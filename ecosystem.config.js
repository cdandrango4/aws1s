module.exports = {
  apps: [{
    name: "mi-node-app",
    script: "./index.js",
    node_args: "--import tsx",
    instances: "max",
    exec_mode: "cluster",

    env: {
      NODE_ENV: "production",
      PORT: 3000,
      MONGODB_URI: "mongodb+srv://cdandrango_db_user:zez5iXeliG7dKokW@cluster0.tjfz0to.mongodb.net/gestion_empleados?retryWrites=true&w=majority&appName=Cluster0"
    },

    error_file: "/var/www/tu-app/logs/err.log",
    out_file: "/var/www/tu-app/logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    merge_logs: true
  }],

  deploy: {
    production: {
      user: "ubuntu",
      host: "44.206.160.252",
      ref: "origin/main",
      repo: "git@github.com:cdandrango4/aws1s.git",
      path: "/var/www/tu-app",
      "post-deploy": "mkdir -p logs && npm install --legacy-peer-deps && (pm2 reload ecosystem.config.cjs --env production || pm2 start ecosystem.config.cjs --env production) && pm2 save",
      ssh_options: "StrictHostKeyChecking=no -i C:/Users/crist/.ssh/ec2practica1.pem"
    }
  }
};
