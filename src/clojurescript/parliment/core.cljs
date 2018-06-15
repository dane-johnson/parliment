(ns parliment.core
  (:require [reagent.core :as reagent :refer [atom]]
            [cljs.reader :refer [read-string]]))

(enable-console-print!)

(defonce socket (js/WebSocket. "ws://localhost:8080/ws"))

(defn send-message
  ([msg] (send-message msg {}))
  ([msg data] (.send socket (str (assoc data :client-message msg)))))

(defonce gamestate (atom {}))

(defn save-gamestate-to-cookie
  []
  (set! (.-cookie js/document) (str "gamestate=" @gamestate ";")))

(defn restore-gamestate-from-cookie
  []
  (reset! gamestate (->> (.-cookie js/document) (re-find #"gamestate=(.+);?") second read-string)))

(defn reset-gamestate
  []
  (do
    (set! (.-cookie js/document) "")
    (reset! gamestate {})))

(declare landing lobby)

(defn render-page
  [page]
  (reagent/render-component [page]
                          (. js/document (getElementById "app"))))

(defn logic-fn
  [msg data]
  (case msg
    :reconnected (render-page lobby)
    :remove-cookie (do
                     (reset-gamestate)
                     (render-page landing))
    :uuid (do
            (swap! gamestate assoc :uuid (:uuid data))
            (save-gamestate-to-cookie)
            (render-page lobby))
    :update-roster (do
                     (swap! gamestate assoc :roster (:roster data)))))

(set! (.-onmessage socket) #(let [data (read-string (.-data %))]
                              (println data)
                              (logic-fn (:server-message data) data)))

(set! (.-onopen socket) #(if (re-find #"gamestate=.+;?" (.-cookie js/document))
                           (do
                             (restore-gamestate-from-cookie)
                             (println send-message)
                             (println socket)
                             (send-message :reconnect {:uuid (:uuid @gamestate) :lobby (:room-code @gamestate)}))
                           (render-page landing)))

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
