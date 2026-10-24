module.exports = {
  apps: [{
    name: "mi-node-app",
    cwd: "/var/www/tu-app/current",
    script: "./index.js",
    node_args: "--import tsx",
    instances: "max",
    exec_mode: "cluster",

    env: {
      NODE_ENV: "production",
      PORT: 3000,
      MONGODB_URI: "mongodb://127.0.0.1:27017/gestion_empleados",
      JWT_SECRET: "UnAHeXAdEcImAL_o_FrAsE_UlTrA_SeCrEtA_Y_LaRgA_2026"
    },

    error_file: "/var/www/tu-app/logs/err.log",
    out_file: "/var/www/tu-app/logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    merge_logs: true
  }],

  deploy: {
    production: {
      user: "ubuntu",
      host: "100.50.25.42",
      ref: "origin/main",
      repo: "https://github.com/cdandrango4/aws1s.git",
      path: "/var/www/tu-app",
      "post-deploy": "mkdir -p logs && npm install --legacy-peer-deps && (pm2 reload ecosystem.config.cjs --env production || pm2 start ecosystem.config.cjs --env production) && pm2 save",
      ssh_options: "StrictHostKeyChecking=no -i C:/Users/crist/.ssh/ec2practica1.pem"
    }
  }
};
