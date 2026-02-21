import { platform } from "os"

function escapeAppleScript(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
}

export namespace Notify {
  export function system(title: string, message: string) {
    const os = platform()

    if (os === "darwin" && Bun.which("osascript")) {
      const t = escapeAppleScript(title)
      const m = escapeAppleScript(message)
      const script = `display notification "${m}" with title "${t}"`
      Bun.spawn(["osascript", "-e", script], {
        stdin: "ignore",
        stdout: "ignore",
        stderr: "ignore",
      })
      return
    }

    if (os === "linux" && Bun.which("notify-send")) {
      Bun.spawn(["notify-send", title, message], {
        stdin: "ignore",
        stdout: "ignore",
        stderr: "ignore",
      })
    }
  }
}
