(ns parliment.core
  (:require [org.httpkit.server :refer [run-server with-channel on-close on-receive
                                        send!]]
            [compojure.core :refer [defroutes GET]]
            [compojure.route :refer [files not-found]]
            [compojure.handler :refer [site]])
  (:gen-class))

;;;;;;;;;;;;;;;;;;;; LOBBY ;;;;;;;;;;;;;;;;;;;;
(defonce lobbies (atom {}))

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
                                           (send-message-lobby lobby :update-roster
                                                               {:roster (-> @lobbies (get-in [lobby :players])
                                                                            (->> (map (fn [[uuid {name :name}]]
                                                                                        {:uuid uuid :name name}))))}))))))))

;;;;;;;;;;;;;;;;;;;; ROUTING ;;;;;;;;;;;;;;;;;;;;

(defroutes all-routes
  (GET "/ws" [] ws-handler)
  (files "" {:root "public"})
  (not-found "<p>404 PAGE NOT FOUND</p>"))

(defn -main [& args]
  (run-server (site #'all-routes) {:port 8080})
  (println "Server running\nLobby Code: " (make-lobby)))
