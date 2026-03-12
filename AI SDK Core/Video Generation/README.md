# AI SDK Core: Video Generation (Experimental)

The AI SDK provides an `experimental_generateVideo` function (aliased as `generateVideo`) to generate videos based on a text prompt or a starting image.

**Important Note:** Video generation typically takes much longer than image or text generation. It is highly recommended to set longer timeouts for these API calls (e.g., 60+ seconds).

## 🚀 Key Concepts

1. **`experimental_generateVideo`**: The core function used to create videos.
2. **Text-to-Video**: Generating a video entirely from a descriptive text prompt.
3. **Image-to-Video**: Generating a video by providing a starting image and a text prompt (e.g., "Animate this image with gentle motion").
4. **`n` (Batch Generation)**: You can request multiple videos at once. Because video models are computationally heavy, the SDK automatically manages batching limits.

## ⚙️ Settings
* **`aspectRatio`**: E.g., `'16:9'` or `'9:16'`.
* **`resolution`**: E.g., `'1280x720'`.
* **`duration`**: Target duration of the generated video in seconds (e.g., `5`).
* **`fps`**: Frames per second (e.g., `24`).

## ☁️ Supported Providers
Because video generation requires immense cloud computing power, you must use specialized APIs:
* **Google** (`veo-2.0-generate-001`)
* **Fal.ai** (Hosts models like `luma-dream-machine/ray-2` and `hunyuan-video`)
* **Kling AI**
* **ByteDance / Alibaba**