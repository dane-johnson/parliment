(ns parliment.core
  (:require [org.httpkit.server :refer :all])
  (:gen-class))

(defonce server (atom nil))

(defn app [req]
  {:status 200
   :headers {"Content-Type" "text/html"}
   :body "Hello World!"})

(defn stop-server []
  (when-not (nil? @server)
    (@server :timeout 100)
    (reset! server nil)))

(reset! server (run-server app {:port 8080}))

(defn -main
  "I don't do a whole lot ... yet."
  [& args]
  (println "Hello, World!"))
