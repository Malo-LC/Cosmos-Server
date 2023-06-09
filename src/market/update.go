package market 

import (
	"net/http"
	"encoding/json"
	"github.com/azukaar/cosmos-server/src/utils" 
	"time"
)

type appDefinition struct {
	Name string `json:"name"`
	Description string `json:"description"`
	Url string `json:"url"`
	LongDescription string `json:"longDescription"`
	Tags []string 		`json:"tags"`
	Repository string	`json:"repository"`
	Image string		`json:"image"`
	Screenshots []string	`json:"screenshots"`
	Icon string		`json:"icon"`
	Compose string	`json:"compose"`
}

type marketDefinition struct {
	Showcase []appDefinition `json:"showcase"`
	All []appDefinition `json:"all"`
	Source string `json:"source"`
}

type marketCacheObject struct {
	Url string	`json:"url"`
	Name string	`json:"name"`
	LastUpdate time.Time	`json:"lastUpdate"`
	Results marketDefinition	`json:"results"`
}

var currentMarketcache []marketCacheObject

func updateCache(w http.ResponseWriter, req *http.Request) error {
	for index, cachedMarket := range currentMarketcache {
		if cachedMarket.LastUpdate.Add(time.Hour * 12).Before(time.Now()) {
			utils.Log("MarketUpdate: Updating market " + cachedMarket.Name)

			// fetch market.url
			resp, err := http.Get(cachedMarket.Url)
			if err != nil {
				utils.Error("MarketUpdate: Error while fetching market" + cachedMarket.Url, err)
				utils.HTTPError(w, "Market Get Error " + cachedMarket.Url, http.StatusInternalServerError, "MK001")
				return err
			}

			defer resp.Body.Close()

			// parse body
			var result marketDefinition
			err = json.NewDecoder(resp.Body).Decode(&result)

			if err != nil {
				utils.Error("MarketUpdate: Error while parsing market" + cachedMarket.Url, err)
				utils.HTTPError(w, "Market Get Error " + cachedMarket.Url, http.StatusInternalServerError, "MK003")
				return err
			}

			cachedMarket.Results = result
			cachedMarket.LastUpdate = time.Now()

			utils.Log("MarketUpdate: Updated market " + result.Source + " with " + string(len(result.All)) + " results")

			// save to cache
			currentMarketcache[index] = cachedMarket
		}
	}

	return nil
}