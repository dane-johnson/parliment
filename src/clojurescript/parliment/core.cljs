(ns parliment.core
  (:require [reagent.core :as reagent :refer [atom]]))

(enable-console-print!)

(def socket (js/WebSocket. "ws://localhost:8080/ws"))
(.send socket "register")

(defn page []
  [:div "Hello World"])

(reagent/render-component [page]
                          (. js/document (getElementById "app")))
