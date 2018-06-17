(ns parliment.core
  (:require [org.httpkit.server :refer [run-server with-channel on-close on-receive
                                        send!]]
            [compojure.core :refer [defroutes GET]]
            [compojure.route :refer [files not-found]]
            [compojure.handler :refer [site]])
  (:gen-class))

;;;;;;;;;;;;;;;;;;;; ROOM ;;;;;;;;;;;;;;;;;;;;

(defonce rooms (atom {}))
(defonce channels (atom {}))
(defonce reconnections-allowed (atom true))

(defn generate-code
  []
  (let [code (atom nil)]
    (while (or (nil? @code) (contains? @rooms @code))
      (reset! code
              (apply str
                     (repeatedly 4 #(char (+ (int \A) (rand-int 26)))))))
    @code))

(defn make-room
  []
  (let [code (generate-code)]
    (swap! rooms assoc code
           {:players {}
            :mode :waiting
            :gamestate {}})
    code))

(defn join-room
  [room-code uuid channel name]
  (swap! rooms update-in [room-code :players] assoc uuid {:channel channel :name name})
  (swap! channels assoc channel room-code))

;;;;;;;;;;;;;;;;;;;; WEBSOCKETS ;;;;;;;;;;;;;;;;;;;;

(defn send-message
  ([channel msg] (send-message channel msg {}))
  ([channel msg data] (send! channel (prn-str (assoc data :server-message msg)))))

(defn send-message-room
  ([room-code msg] (send-message-room room-code msg {}))
  ([room-code msg data]
   (doseq [channel (map #(:channel %) (vals (get-in @rooms [room-code :players])))]
     (send-message channel msg data))))

(defn update-roster
  [room-code]
  (send-message-room room-code :update-roster
                      {:roster (-> @rooms (get-in [room-code :players])
                                   (->> (map (fn [[uuid {name :name}]]
                                               {:uuid uuid :name name}))))}))

(defn update-mode
  [room-code]
  (send-message-room room-code :update-mode {:mode (get-in @rooms [room-code :mode])}))

(defn ws-handler
  [request]
  (with-channel request channel
    (on-close channel (fn [status]
                        (println "channel closed: " status)
                        (swap! channels dissoc channel)))
    (on-receive channel (fn [raw]
                          (let [data (clojure.edn/read-string raw)
                                msg (:client-message data)
                                room-code (get @channels channel)]
                            (case msg
                              :make-room (let [room-code (make-room)]
                                            (send-message channel :room-created {:room-code room-code}))
                              :join-room (let [uuid (str (java.util.UUID/randomUUID))]
                                           (send-message channel :uuid {:uuid uuid})
                                           (join-room (:room-code data) uuid channel (:name data))
                                           (update-roster (:room-code data)))
                              :reconnect (do
                                           
                                           (if (and
                                                @reconnections-allowed
                                                (contains? @rooms (:room-code data))
                                                (contains? (get-in @rooms [(:room-code data) :players]) (:uuid data)))
                                             (do
                                               (swap! rooms assoc-in [(:room-code data) :players (:uuid data) :channel] channel)
                                               (send-message channel :reconnected)
                                               (update-roster (:room-code data)))
                                             (send-message channel :remove-cookie)))))))))

;;;;;;;;;;;;;;;;;;;; ROUTING ;;;;;;;;;;;;;;;;;;;;

(defroutes all-routes
  (GET "/ws" [] ws-handler)
  (files "" {:root "public"})
  (not-found "<p>404 PAGE NOT FOUND</p>"))

(defonce shutdown (atom nil))

(defn -main [& args]
  (reset! reconnections-allowed false)
  (reset! shutdown (run-server (site #'all-routes) {:port 8080}))
  (println "Server running!"))
