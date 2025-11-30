module.exports = {
  packagerConfig: {
    name: "ChatGPT",
    executableName: "ChatGPT",
    icon: "images/icon",
    appBundleId: "com.vincelwt.chatgptmac",
    osxSign: false,
    osxNotarize: false
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-dmg",
      platforms: ["darwin"],
      config: {}
    },
    { name: "@electron-forge/maker-zip", platforms: ["darwin"], config: {} }
  ]
};
