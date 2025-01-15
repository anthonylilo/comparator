import React, { useState } from "react";
import axios from "axios";
import { load } from 'cheerio';


const DataLayerCrawler = () => {
  const [urls, setUrls] = useState(""); // Updated to handle multiple URLs
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setData([]);
    
    const recipeIds = []; // This will store all the recipe IDs

    const urlList = urls.split(",").map(url => url.trim()); // Split and trim the URLs

    try {
      // Loop through each URL and fetch data
      for (const url of urlList) {
        const response = await axios.get(url);

        // Use Cheerio to parse the HTML
        const $ = cheerio.load(response.data);

        // Find the script tag containing "dataLayer_tags"
        const scriptContent = $('script')
          .toArray()
          .map((script) => $(script).html())
          .find((content) => content && content.includes("dataLayer_tags"));

        if (scriptContent) {
          // Safely extract and evaluate the `dataLayer_tags` object
          const dataLayerTags = eval(`(${scriptContent.match(/var dataLayer_tags = (.*?);/s)[1]})`);

          // Extract desired information
          const recipeId = dataLayerTags?.recipeInformation?.recipeId;
          const recipeName = dataLayerTags?.recipeInformation?.recipeName;

          if (recipeId) {
            recipeIds.push(recipeId); // Add the recipeId to the array
          }

          setData(prevData => [...prevData, { recipeId, recipeName }]); // Store the data for each URL
        } else {
          setError("No dataLayer_tags found on one of the pages.");
        }
      }

      // After all URLs are crawled, generate the shortcode string
      const shortCode = `[recipecard recipes="${recipeIds.join(",")}"]MÁS RECETAS CON QUESO:[/recipecard]`;

      setData(prevData => [...prevData, { shortCode }]); // Add the shortcode to the data

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please check the URLs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>DataLayer Crawler</h1>
      <input
        type="text"
        placeholder="Enter URLs (separate with commas)"
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
        style={{ padding: "0.5rem", width: "300px" }}
      />
      <button
        onClick={fetchData}
        style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
      >
        Crawl
      </button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data.length > 0 && (
        <div>
          <h3>Extracted Data:</h3>
          {data.map((item, index) => (
            <div key={index}>
              {item.recipeId && <h3>Recipe Name: {item.recipeName}</h3>}
              {item.recipeId && <p>Recipe ID: {item.recipeId}</p>}
              {item.shortCode && <p>{item.shortCode}</p>} {/* Display the shortcode */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataLayerCrawler;
