import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/youtube/channel", async (req, res) => {
    try {
      const { handle } = req.query;
      if (!handle || typeof handle !== 'string') {
        return res.status(400).json({ error: "Handle is required" });
      }

      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "YOUTUBE_API_KEY environment variable is required" });
      }

      // 1. Search for the channel by handle to get the channel ID
      const searchRes = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(handle)}&key=${apiKey}`);
      const searchData = await searchRes.json();
      
      if (!searchData.items || searchData.items.length === 0) {
        return res.status(404).json({ error: "Channel not found" });
      }

      const channelId = searchData.items[0].id.channelId;

      // 2. Get channel details (banner, logo, description, uploads playlist ID)
      const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,brandingSettings,statistics&id=${channelId}&key=${apiKey}`);
      const channelData = await channelRes.json();

      if (!channelData.items || channelData.items.length === 0) {
        return res.status(404).json({ error: "Channel details not found" });
      }

      const channelInfo = channelData.items[0];
      const uploadsPlaylistId = channelInfo.contentDetails.relatedPlaylists.uploads;

      // 3. Get recent videos from the uploads playlist
      const playlistRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=10&key=${apiKey}`);
      const playlistData = await playlistRes.json();

      const videos = playlistData.items?.map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        publishedAt: item.snippet.publishedAt,
      })) || [];

      res.json({
        id: channelInfo.id,
        title: channelInfo.snippet.title,
        description: channelInfo.snippet.description,
        thumbnail: channelInfo.snippet.thumbnails?.high?.url,
        banner: channelInfo.brandingSettings?.image?.bannerExternalUrl,
        keywords: channelInfo.brandingSettings?.channel?.keywords || "",
        subscriberCount: channelInfo.statistics.subscriberCount,
        videos,
      });

    } catch (error) {
      console.error("YouTube API Error:", error);
      res.status(500).json({ error: "Failed to fetch YouTube data" });
    }
  });

  app.get("/api/youtube/video", async (req, res) => {
    try {
      const { videoId } = req.query;
      if (!videoId || typeof videoId !== 'string') {
        return res.status(400).json({ error: "Video ID is required" });
      }

      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "YOUTUBE_API_KEY environment variable is required" });
      }

      const videoRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`);
      const videoData = await videoRes.json();

      if (!videoData.items || videoData.items.length === 0) {
        return res.status(404).json({ error: "Video not found" });
      }

      const videoInfo = videoData.items[0];

      res.json({
        id: videoInfo.id,
        title: videoInfo.snippet.title,
        description: videoInfo.snippet.description,
        tags: videoInfo.snippet.tags || [],
        viewCount: videoInfo.statistics.viewCount,
        likeCount: videoInfo.statistics.likeCount,
        commentCount: videoInfo.statistics.commentCount,
      });

    } catch (error) {
      console.error("YouTube API Error:", error);
      res.status(500).json({ error: "Failed to fetch video data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
