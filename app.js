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
    //Información del Medicamento
    const nameMedicine = document.getElementById('nameMedicine').value;
    const presentation = document.getElementById('presentation').value;
    const dose = document.getElementById('dose').value;
    const amount = document.getElementById('amount').value;
    const diagnosis = document.getElementById('disgnosis').value;
    const applicationDate = document.getElementById('applicationDate').value;
    //Datos de la prescripción médica
    const doctorName = document.getElementById('doctorName').value;
    const recipeDate = document.getElementById('recipeDate').value;
    const institution = document.getElementById('institution').value;
    //Observaciones adicionales
    const observations = document.getElementById('observations').value;

    // Crear el objeto patient en formato FHIR
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
        telecom: [{
            system: "phone",
            value: cellPhone,
            use: "home"
        }, {
            system: "email",
            value: email,
            use: "home"
        }],
        address: [{
            use: "home",
            line: [address],
            city: city,
            postalCode: postalCode,
            country: "Colombia"
    }],

    };

    // Enviar los datos de Patient usando Fetch API
    fetch('https://backend-medication-request.onrender.com/medicationRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patient)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Paciente creado exitosamente!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al crear el paciente.');
    });


    // Crear el objeto MedicationRequest en formato FHIR
    const medicationRequest = {
    resourceType: "MedicationRequest",
    status: "active",  // Estado de la solicitud (active, completed, cancelled)
    intent: "order",   // Propósito (order, plan, proposal)
    
    // Medicamento solicitado
    medicationCodeableConcept: {
        text: nameMedicine,  // Nombre del medicamento en texto libre
        coding: [{
            display: `${nameMedicine} - ${presentation}`  // Nombre + presentación
        }]
    },
    
    // Paciente (En teoría, se debería obtener esta referencia del Patient existente)
    subject: {
        reference: "Patient/12345",  // ID del paciente en el sistema
        display: "Nombre del Paciente"  // Nombre para mostrar
    },
    
    // Médico que prescribe
    requester: {
        reference: `Practitioner/${doctorName.replace(/\s+/g, '-')}`,  // Referencia al médico
        display: doctorName
    },
    
    // Institución de salud
    supportingInformation: [{
        reference: `Organization/${institution.replace(/\s+/g, '-')}`,
        display: institution
    }],
    
    // Fechas importantes
    authoredOn: recipeDate,  // Fecha de la receta
    dosageInstruction: [{
        text: dose,  // Dosis en texto libre
        timing: {
            event: [applicationDate]  // Fecha de aplicación
        }
    }],
    
    // Cantidad
    quantity: {
        value: parseInt(amount),  // Cantidad solicitada
        unit: "Unidades"  //dependen del medicamento
    },
    
    // Razón/motivo
    reasonCode: [{
        text: diagnosis  // Diagnóstico o justificación
    }],
    
    // Observaciones
    note: [{
        text: observations || "Sin observaciones adicionales"
    }],
    
    // Validación de sustitución
    substitution: {
        allowedBoolean: false  // ¿Permite sustitución genérica?
    }
};

    // Enviar los datos usando Fetch API
    fetch('https://backend-medication-request.onrender.com/medicationRequest', { //Aquí estaría el backend de Render
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(patient)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Paciente creado exitosamente!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un error al procesar la solicitud de medicamento.');
    });
});
