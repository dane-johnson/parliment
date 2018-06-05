(ns parliment.core
  (:require [org.httpkit.server :refer [run-server with-channel on-close on-receive]]
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
           {:players []
            :mode :waiting
            :gamestate {}})
    code))

(defn join-lobby
  [lobby player]
  (swap! lobbies update-in [lobby :players] conj player))

;;;;;;;;;;;;;;;;;;;; WEBSOCKETS ;;;;;;;;;;;;;;;;;;;;
(defn ws-handler
  [request]
  (with-channel request channel
    (on-close channel (fn [status]
                        (println "channel closed: " status)))
    (on-receive channel (fn [data]
                          (println data)))))

;;;;;;;;;;;;;;;;;;;; ROUTING ;;;;;;;;;;;;;;;;;;;;

(defroutes all-routes
  (GET "/ws" [] ws-handler)
  (files "" {:root "public"})
  (not-found "<p>404 PAGE NOT FOUND</p>"))

(defn -main [& args]
  (run-server (site #'all-routes) {:port 8080})
  (println "Server running!"))
