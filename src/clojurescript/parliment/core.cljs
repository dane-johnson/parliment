(ns parliment.core
  (:require [reagent.core :as reagent :refer [atom]]
            [cljs.reader :refer [read-string]]))

(enable-console-print!)

(defonce socket (js/WebSocket. "ws://localhost:8080/ws"))
(defonce gamestate (atom {}))

(declare landing lobby)

(defn render-page
  [page]
  (reagent/render-component [page]
                          (. js/document (getElementById "app"))))

(defn logic-fn
  [msg data]
  (case msg
    :uuid (do
            (println "My uuid is" (:uuid data))
            (render-page lobby))))

(set! (.-onmessage socket) #(let [data (read-string (.-data %))]
                              (println data)
                              (logic-fn (:server-message data) data)))

(defn send-message
  ([msg] (send-message msg {}))
  ([msg data] (.send socket (str (assoc data :client-message msg)))))

;;;;;;;;;;;;;;;;;;;; PAGES ;;;;;;;;;;;;;;;;;;;;
(defn landing
  []
  (let [state (atom {})]
    [:div
     [:label "Name"]
     [:input {:type "text"
              :on-change #(swap! state assoc :name (-> % .-target .-value))}]
     [:label "Room Code"]
     [:input {:type "text"
              :on-change #(swap! state assoc :room-code (-> % .-target .-value))}]
     [:button {:on-click #(do (send-message :join-room @state)
                              (swap! gamestate conj @state))} "Join Game"]]))

(def timer (atom 0))

(js/setInterval #(swap! timer inc) 1000)

(defn lobby
  []
  [:div "Welcome to the game " (:name @gamestate) "! The game will begin soon! The count is " @timer])

(render-page landing)
