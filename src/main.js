
const root = document.getElementById("root");
const navbutton = document.getElementById("docState");

let docState = 'Patient';
let queueState = 'entry';
let PatientList = {};
let waitingCode = 'asdfgh';
let docPassword = 'password';

navbutton.addEventListener('click', function(e){
    navbutton.textContent = `I am ${docState}`;
    docState = docState=='Doctor'?'Patinet':'Doctor';
    if (docState === 'Doctor'){
        main.Doctor.entry();
    }else{
        main.Patient.entry();
    }
});
let patientId =0;
let patientEntryForm = `
    <div class="center">
      <div class="form" id ="patientEntry">
        <h2> Add yourself to Queue</h2>
        <label for="">Full Name</label><br>
        <input id="entryName" name="name" type="text" placeholder="Your Name" required><br><br>
        <label for="">Waiting Code</label><br>
        <input id="entryPassword" type="password" placeholder="Waiting Code. You can find at front desk." required><br>
        <p>*You should find it at front desk</p>
        <button id = "patientEntryBtn">submit</button>
      </div>
    </div>`
let doctorEntry = `
    <div class="center">
      <div class="form" id ="doctorEntry">
        <h2> Please enter your passkey</h2>
        <label for="">Passkey</label><br>
        <input id="entryPassword" type="password" placeholder="Pass key" required><br><br>
        <button id = "doctorEntryBtn">submit</button>
      </div>
    </div>`

let doctorView = `
    <div class="center">
      <table>
        <tr>
          <th>Patient Name</th>
          <th>Waiting Since</th>
          <th>Coin Earned</th>
        </tr>
        <div id="data"></div>
      </table>
    </div>
`
function claim(id){
    PatientList[id].claimed = true;
}

main ={
    Patient : {
        entry : () =>{
            root.innerHTML = patientEntryForm;
            entryButton = document.getElementById('patientEntryBtn');
            entryButton.addEventListener('click', function(e){
                if (document.getElementById('entryPassword').value ===waitingCode){
                    const d = new Date();
                    patientId +=1;
                    PatientList[patientId] = {
                        id: patientId,
                        name : document.getElementById('entryName').value,
                        entryTime : d.getSeconds(), // TODO initialise time properly
                        claimed : false
                    };
                    main.Patient.waiting();
                }else {
                    alert ('Wrong Waiting Code. Please visit front desk.')
                }
            });
        },
        waiting : () =>{
            // TODO Refactor this code look at view
            const d = new Date();
            let waitedSec = d.getSeconds()-PatientList[patientId].entryTime;
            if (PatientList[patientId].claimed){
                clearTimeout(loop);
                root.innerHTML = `
                    <div class="center">
                        <div class="message">
                            <p>Thank you for your patience! You have been claimed. Please proceed to front desk.</p>
                            <p>You waited for ${waitedSec} seconds and thus have been compensated ${waitedSec*5} Kcoin as per our policy.</p>
                        </div>
                        <button id="proceed">Proceed</button>
                    </div>
                    ` 
                document.getElementById("proceed").addEventListener('click', ()=>{
                    main.Patient.entry();
                });  
            }
            else{
                root.innerHTML = `
                    <div class="center">
                        <div class="message">
                            <p>We are so sorry to make you wait.</p>
                            <p>You have waited ${waitedSec} seconds and we are compensating ${waitedSec*5} Kcoin for that as per our policy.</p>
                            <p>Please stay tuned. You will be claimed soon.</p>
                        </div>
                    </div>
                    `
                loop = setTimeout(()=>{
                    main.Patient.waiting();
                },50);
            }
        }
    },
    Doctor : {
        entry : () =>{
            root.innerHTML = doctorEntry;
            entryButton = document.getElementById('doctorEntryBtn');
            entryButton.addEventListener('click', function(e){
                if (document.getElementById('entryPassword').value ===docPassword){
                    main.Doctor.view();
                }else {
                    alert ('Wrong PassKey! Are you sure you are the doctor?')
                }
            });
        },
        view : () =>{
            root.innerHTML = doctorView;
            data = ``;
            for (let patient of PatientList){
                data +=`          
                    <tr>
                        <td>${patient.name}</td>
                        <td>${patient.entryTime}</td>
                        <td>${patient.entryTime}</td>
                        <td><button onclick="claim(${patientId})">Claim</button></td>
                    </tr>
                `
            }
            document.getElementById("data").innerHTML = data;
        }
    }
}

main.Patient.entry();

