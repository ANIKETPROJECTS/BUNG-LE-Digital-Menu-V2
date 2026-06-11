module.exports = {
  apps: [{
    name: "BungleDigitalMenu",
    script: "./dist/index.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
      PORT: 4010,
      MONGODB_URI: "mongodb+srv://raneaniket23_db_user:5MIiySrJlljOOOBY@bungle.hggnj83.mongodb.net/?appName=BUNGLE",
      SESSION_SECRET: "ZTYj/a2OXy7iabAxcXL+ue17Aw3pQPg7wmyjLWvduDU4t/jS37xQriltz3khKboxGBhjje3+rqc7l7YuNmdOCA=="
    }
  }]
};
