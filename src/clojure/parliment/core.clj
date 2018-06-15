(ns parliment.core
  (:require [org.httpkit.server :refer [run-server with-channel on-close on-receive
                                        send!]]
            [compojure.core :refer [defroutes GET]]
            [compojure.route :refer [files not-found]]
            [compojure.handler :refer [site]])
  (:gen-class))

;;;;;;;;;;;;;;;;;;;; LOBBY ;;;;;;;;;;;;;;;;;;;;
(defonce lobbies (atom {}))

(def ^:dynamic *reconnection-allowed* true)

(defn generate-code
  []
  (let [code (atom nil)]
    (while (or (nil? @code) (contains? @lobbies @code))
      (reset! code
              (apply str
                     (repeatedly 4 #(char (+ (int \A) (rand-int 26)))))))
    @code))

(defn make-lobby
  []
  (let [code (generate-code)]
    (swap! lobbies assoc code
           {:players {}
            :mode :waiting
            :gamestate {}})
    code))

(defn join-lobby
  [lobby uuid channel name]
  (swap! lobbies update-in [lobby :players] assoc uuid {:channel channel :name name}))

;;;;;;;;;;;;;;;;;;;; WEBSOCKETS ;;;;;;;;;;;;;;;;;;;;

(defn send-message
  ([channel msg] (send-message channel msg {}))
  ([channel msg data] (send! channel (prn-str (assoc data :server-message msg)))))

(defn send-message-lobby
  ([lobby msg] (send-message-lobby lobby msg {}))
  ([lobby msg data] (doseq [channel (map #(:channel %) (vals (get-in @lobbies [lobby :players])))]
                      (send-message channel msg data))))
(defn update-roster
  [lobby]
  (send-message-lobby lobby :update-roster
                      {:roster (-> @lobbies (get-in [lobby :players])
                                   (->> (map (fn [[uuid {name :name}]]
                                               {:uuid uuid :name name}))))}))

(defn ws-handler
  [request]
  (with-channel request channel
    (on-close channel (fn [status]
                        (println "channel closed: " status)))
    (on-receive channel (fn [raw]
                          (let [data (clojure.edn/read-string raw)
                                msg (:client-message data)]
                            (case msg
                              :join-room (let [uuid (str (java.util.UUID/randomUUID))
                                               lobby (key (first @lobbies))]
                                           (send-message channel :uuid {:uuid uuid})
                                           (join-lobby lobby uuid channel (:name data))
                                           (update-roster lobby))
                              :reconnect (do
                                           (if (and
                                                *reconnection-allowed*
                                                (contains? @lobbies (:lobby data))
                                                (contains? (get-in @lobbies [(:lobby data) :players]) (:uuid data)))
                                             (do
                                               (swap! lobbies assoc-in [(:lobby data) :players (:uuid data) :channel] channel)
                                               (send-message channel :reconnected)
                                               (update-roster (:lobby data)))
                                             (send-message channel :remove-cookie)))))))))

;;;;;;;;;;;;;;;;;;;; ROUTING ;;;;;;;;;;;;;;;;;;;;

(defroutes all-routes
  (GET "/ws" [] ws-handler)
  (files "" {:root "public"})
  (not-found "<p>404 PAGE NOT FOUND</p>"))

(defn -main [& args]
  (binding [t*reconnection-allowed* false]
    (run-server (site #'all-routes) {:port 8080})
    (println "Server running\nLobby Code: " (make-lobby))))
