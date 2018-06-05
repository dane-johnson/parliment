(ns parliment.core
  (:require [reagent.core :as reagent :refer [atom]]))

(enable-console-print!)

(defn page []
  [:div "Hello World"])

(reagent/render-component [page]
                          (. js/document (getElementById "app")))
