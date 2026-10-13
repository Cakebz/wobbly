# LyricDrop

Live, synced lyrics for whatever is playing on Spotify, as customizable Android home-screen widgets
(plus an in-app lyric view, widget studio, and shareable lyric cards). Built in Kotlin + Jetpack Compose from
the "Syncline" Stitch design.

## Get the APK (no Android Studio needed)

1. Create a new GitHub repo and push this folder to it.
2. Open the repo's **Actions** tab → **Build APK** → wait ~5 minutes (or click **Run workflow**).
3. Open the finished run → **Artifacts** → download **LyricDrop-apk**.
4. Copy `app-release.apk` (or `app-debug.apk`) to your phone and open it.
   Allow "Install unknown apps" for your file manager/browser when asked.

## Or build locally

Open the folder in Android Studio (Ladybug or newer) and press Run, or from a terminal with JDK 17 + the
Android SDK installed:

    ./gradlew assembleDebug
    # -> app/build/outputs/apk/debug/app-debug.apk

## First run on the phone

1. Open **LyricDrop** → tap **Grant notification access** → switch LyricDrop on.
   (This is how Android exposes Spotify's "now playing" session. No notification text is read.)
   If the toggle is greyed out: Settings → Apps → LyricDrop → ⋮ → **Allow restricted settings**, then retry.
2. Play a song in Spotify. Lyrics appear in the app within a second or two.
3. **Widgets** tab → **Add to Home** on any widget, or long-press the home screen → Widgets → LyricDrop.
4. **Studio** tab to restyle: theme, glass opacity, font, glow colour, album art, progress bar, 1 vs 3 lines.

For reliable background updates, exempt LyricDrop from battery optimisation
(Settings → Apps → LyricDrop → Battery → Unrestricted), especially on Xiaomi/Samsung/OnePlus.

## How it works

| Piece | File |
|---|---|
| Reads Spotify's media session (title, artist, position, art) | `service/NowPlayingService.kt` |
| Lyrics lookup (LRCLIB), title cleanup, disk cache | `data/LyricsRepository.kt` |
| LRC parsing + binary-search line lookup | `data/LrcParser.kt` |
| Widgets drawn with Canvas (fonts, glow, glass themes) | `widget/WidgetRenderer.kt` |
| Home-screen widget providers | `widget/WidgetUpdater.kt` |
| Screens (Now Playing, Widgets, Studio, Saved) | `ui/*.kt` |

Widgets are rendered to a bitmap, so the in-app previews are pixel-identical to the real widgets.

## Notes and limits

- **Lyrics source:** [LRCLIB](https://lrclib.net), a free open database of time-synced lyrics. Not every song is
  covered; unsynced and missing tracks are reported in the UI. Spotify's own lyrics (licensed from Musixmatch)
  are not accessible to third-party apps, and this project does not scrape them.
- **Personal use:** lyrics are copyrighted. This is fine as a personal tool; if you ever publish to the Play Store,
  you'll need a licensed lyrics provider.
- **Release build** is signed with the debug key so it installs directly. Use your own keystore before publishing.
- Home-screen widgets refresh about every 0.4 s while a line changes, throttled by what Android allows launchers
  to accept; very fast line changes may lag a moment on some launchers.
- Supports Spotify (`com.spotify.music`, `com.spotify.lite`). Ads are ignored.
