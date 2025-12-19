# Video Files Setup

All video files are stored in Git LFS (Large File Storage). To make all videos work, you need to pull the actual video files from Git LFS.

## Quick Setup

Run this command in your terminal:

```bash
./pull-videos.sh
```

Or manually:

```bash
git lfs pull --include="public/assets/videos/*.mp4"
```

## If Authentication is Required

If you get authentication errors, you may need to:

1. **Configure Git credentials:**
   ```bash
   git config credential.helper store
   ```

2. **Or authenticate manually:**
   ```bash
   git lfs pull
   ```
   (Enter your GitHub credentials when prompted)

## Verify Videos are Working

After pulling, verify the files are real videos (not pointers):

```bash
file public/assets/videos/*.mp4
```

Real video files should show "ISO Media" or similar, not "ASCII text".

## Available Video Files

- `hero.mp4` - Hero section video
- `smallHero.mp4` - Small hero video
- `highlight-first.mp4` - First highlight (desktop)
- `highlight-first-mobile.mp4` - First highlight (mobile)
- `hightlight-sec.mp4` - Second highlight (desktop)
- `hightlight-sec-mobile.mp4` - Second highlight (mobile)
- `hightlight-third.mp4` - Third highlight (desktop)
- `hightlight-third-mobile.mp4` - Third highlight (mobile)
- `hightlight-fourth.mp4` - Fourth highlight
- `explore.mp4` - Explore video
- `frame.mp4` - Frame video
- `Final (2).mp4` - Studio video (already working)

## Current Status

- ✅ `Final (2).mp4` - Working (1.1MB real file)
- ⚠️ All other videos - Git LFS pointers (need to be pulled)

