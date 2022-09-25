App = {
    loading: false,
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
      App.account = web3.eth.accounts[0]
    },
  
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const blockchain = await $.getJSON('Blockchain.json')
      App.contracts.Blockchain = TruffleContract(blockchain)
      App.contracts.Blockchain.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.blockchain = await App.contracts.Blockchain.deployed()
    },
  
    render: async () => {
      // Prevent double render
      if (App.loading) {
        return
      }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      $('#account').html(App.account)
  
      // Render Patients
      await App.renderPatients()
  
      // Update loading state
      App.setLoading(false)
    },
  
    renderPatients: async () => {
      // Load the total patient count from the blockchain
      const totalPatient = await App.blockchain.totalPatient()
      const $patientTemplate = $('.patientTemplate')
  
      // Render out each patient with a new patient template
      for (var i = 1; i <= totalPatient; i++) {
        // Fetch the patient data from the blockchain
        const patient = await App.blockchain.patientList(i)
        const patientId = patient[0].toNumber()
        const patientName = patient[1]
        const patientWaitingSince = patient[2]
        const patientEarned = patient[3]
        const patientCalled = patient[4]
  
        // Create the html for the patient
        const $newPatientTemplate = $patientTemplate.clone()
        $newPatientTemplate.find('.patientName').html(patientName)
        $newPatientTemplate.find('.patientStartTime').html(patientWaitingSince)
        $newPatientTemplate.find('.patientCoins').html(patientEarned)
        $newPatientTemplate.find('input')
                        .prop('name', patientId)
                        .prop('checked', patientCalled)
                        .on('click', App.toggleCompleted)
  
        // Put the patient in the correct list
        if (patientCompleted) {
          $('#completedPatientList').append($newPatientTemplate)
        } else {
          $('#patientList').append($newPatientTemplate)
        }
  
        // Show the patient
        $newPatientTemplate.show()
      }
    },
  
    newPatient: async () => {
      App.setLoading(true)
      const content = $('#newPatient').val()
      await App.blockchain.newPatient(content)
      window.location.reload()
    },
  
    toggleCompleted: async (e) => {
      App.setLoading(true)
      const patientId = e.target.name
      await App.blockchain.patientVisit(patientId)
      window.location.reload()
    },
  
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })