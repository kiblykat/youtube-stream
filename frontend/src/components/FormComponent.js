import React, { useState } from "react";
import classes from "./FormComponent.module.css";

function FormComponent() {
  const [url, setUrl] = useState("");
  const [audioInfo, setAudioInfo] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `/get-audio-info?url=${encodeURIComponent(url)}`
      );
      if (response.ok) {
        const info = await response.json();
        setAudioInfo(info);
      } else {
        alert("Failed to get audio information.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while fetching audio information.");
    }
  };

  return (
    <div className={classes.container}>
      <h1>YouTube Audio Streamer</h1>
      <form className={classes.inputForm} onSubmit={handleSubmit}>
        <input
          className={classes.urlInput}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
        />
        <button type="submit">Get Audio</button>
      </form>

      {audioInfo && (
        <div>
          <h2>{audioInfo.title}</h2>
          <audio controls>
            <source src={audioInfo.streamUrl} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}

export default FormComponent;
