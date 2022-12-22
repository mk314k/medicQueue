// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Blockchain{
    uint public totalPatient = 0;

    struct Patient {
        uint id;
        string name;
        uint timeStarted;
        uint coinEarned;
        bool calledByDoctor;
    }

    mapping(uint => Patient) public patientList;

    event newPatientAdded(
        uint id,
        string name,
        uint timeStarted,
        uint coinEarned,
        bool calledByDoctor
    );

    event patientVisited(
        uint id,
        bool visited
    );

    constructor() public{
        newPatient("test");
    }

    function newPatient(string memory _patientName) public {
        totalPatient ++;
        patientList[totalPatient] = Patient(totalPatient, _patientName, block.timestamp, 0, false);
        emit newPatientAdded(totalPatient, _patientName, block.timestamp, 0, false);
    }

    function patientVisit(uint _id) public {
        Patient memory _patient = patientList[_id];
        _patient.calledByDoctor = !_patient.calledByDoctor;
        patientList[_id] = _patient;
        emit patientVisited(_id, _patient.calledByDoctor);
    }

}