module.exports = {
  networks: {
    ganache: {
      host: "localhost",
      port: 7545,
      network_id: "5777"
    },
    dev: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
    test: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
  },
};
