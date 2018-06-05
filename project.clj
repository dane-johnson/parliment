(defproject parliment "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "GNU-GPLv3"
            :url "https://www.gnu.org/licenses/gpl.html"}
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [http-kit "2.2.0"]
                 [compojure "1.6.1"]
                 [javax.servlet/servlet-api "2.5"]
                 [org.clojure/clojurescript "1.10.238"]
                 [reagent "0.7.0"]]
  :plugins [[lein-cljsbuild "1.1.7"]]
  :cljsbuild {:builds [{:source-paths ["src/clojurescript"]
                        :compiler {:output-to "public/static/main.js"
                                   :optimizations :whitespace
                                   :pretty-print true}}]}
  :source-paths ["src/clojure"]
  :main ^:skip-aot parliment.core
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all}})
