document.getElementById('patientForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const name = document.getElementById('name').value;
    const familyName = document.getElementById('familyName').value;
    const gender = document.getElementById('gender').value;
    const birthDate = document.getElementById('birthDate').value;
    const identifierSystem = document.getElementById('identifierSystem').value;
    const identifierValue = document.getElementById('identifierValue').value;
    const cellPhone = document.getElementById('cellPhone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postalCode').value;

    const nameMedicine = document.getElementById('nameMedicine').value;
    const presentation = document.getElementById('presentation').value;
    const dose = document.getElementById('dose').value;
    const amount = document.getElementById('amount').value;
    const diagnosis = document.getElementById('diagnosis').value;
    const applicationDate = document.getElementById('applicationDate').value;

    const doctorName = document.getElementById('doctorName').value;
    const recipeDate = document.getElementById('recipeDate').value;
    const institution = document.getElementById('institution').value;

    const observations = document.getElementById('observations').value;

    const patient = {
        resourceType: "Patient",
        name: [{
            use: "official",
            given: [name],
            family: familyName
        }],
        gender: gender,
        birthDate: birthDate,
        identifier: [{
            system: identifierSystem,
            value: identifierValue
        }],
        telecom: [
            { system: "phone", value: cellPhone, use: "home" },
            { system: "email", value: email, use: "home" }
        ],
        address: [{
            use: "home",
            line: [address],
            city: city,
            postalCode: postalCode,
            country: "Colombia"
        }]
    };

    // Enviar paciente
    fetch('https://backend-medication-request.onrender.com/patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Paciente creado:', data);
        alert('Paciente creado exitosamente!');

        // Ahora usar el ID del paciente para la solicitud de medicamento
        const patientId = data.id || "12345";  // Asegúrate de que el backend retorne el ID

        const medicationRequest = {
            resourceType: "MedicationRequest",
            status: "active",
            intent: "order",
            medicationCodeableConcept: {
                text: nameMedicine,
                coding: [{ display: `${nameMedicine} - ${presentation}` }]
            },
            subject: {
                reference: `Patient/${patientId}`,
                display: `${name} ${familyName}`
            },
            requester: {
                reference: `Practitioner/${doctorName.replace(/\s+/g, '-')}`,
                display: doctorName
            },
            supportingInformation: [{
                reference: `Organization/${institution.replace(/\s+/g, '-')}`,
                display: institution
            }],
            authoredOn: recipeDate,
            dosageInstruction: [{
                text: dose,
                timing: { event: [applicationDate] }
            }],
            quantity: {
                value: parseInt(amount),
                unit: "Unidades"
            },
            reasonCode: [{
                text: diagnosis
            }],
            note: [{
                text: observations || "Sin observaciones adicionales"
            }],
            substitution: {
                allowedBoolean: false
            }
        };

        // Enviar solicitud de medicamento
        return fetch('https://backend-medication-request.onrender.com/medicationRequest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicationRequest)
        });
    })
    .then(response => response.json())
    .then(data => {
        console.log('Solicitud de medicamento enviada:', data);
        alert('Solicitud de medicamento enviada correctamente!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al procesar la información.');
    });
});
