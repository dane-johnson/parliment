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
            (swap! gamestate assoc :uuid (:uuid data))
            (println "My uuid is" (:uuid data))
            (render-page lobby))
    :update-roster (do
                     (swap! gamestate assoc :roster (:roster data)))))

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

(defn other-players
  []
  [:div [:p "Other players:"]
   [:ul (map #(if (not= (:uuid %) (:uuid @gamestate))
                [:li (:name %)]) (:roster @gamestate))]])

(defn lobby
  []
  [:div "Welcome to the game " (:name @gamestate) "! The game will begin soon!" (other-players)])

(render-page landing)
