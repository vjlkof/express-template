export default {
  apps: [
    {
      name: "template",
      script: "./dist/index.js",
      restart_delay: 3000, //ms to wait until run again
      min_uptime: "45s", //Treshold defined to consider for max_restarts
      max_restarts: 10, //max tries in the min_uptime before errored
      instance: 1,
    },
  ],
  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
