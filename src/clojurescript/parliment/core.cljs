(ns parliment.core
  (:require [reagent.core :as reagent :refer [atom]]))

(enable-console-print!)

(defonce socket (js/WebSocket. "ws://localhost:8080/ws"))

(defn logic-fn
  [msg data]
  (case msg
    :uuid (println "My uuid is" (:uuid data))))

(set! (.-onmessage socket) #(let [data (cljs.reader/read-string (.-data %))]
                              (println data)
                              (logic-fn (:server-message data) data)))

(defn send-message
  ([msg] (send-message msg {}))
  ([msg data] (.send socket (str (assoc data :client-message msg)))))

(defn page []
  (let [state (atom {})]
    [:div
     [:label "Name"]
     [:input {:type "text"
              :on-change #(swap! state assoc :name (-> % .-target .-value))}]
     [:label "Room Code"]
     [:input {:type "text"
              :on-change #(swap! state assoc :room-code (-> % .-target .-value))}]
     [:button {:on-click #(send-message :join-room @state)} "Join Game"]]))

(reagent/render-component [page]
                          (. js/document (getElementById "app")))
