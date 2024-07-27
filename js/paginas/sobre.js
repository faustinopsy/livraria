export function renderSobre() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `<h1>Sobre</h1>`;
    Promise.all([
        fetch('json/sobre.json').then(response => response.json()),
        fetch('json/skills.json').then(response => response.json()),
        fetch('json/services.json').then(response => response.json()),
        fetch('json/experience.json').then(response => response.json()),
        fetch('json/education.json').then(response => response.json())
    ])
    .then(([sobreData, skillsData, servicesData, experienceData, educationData]) => {
        const sobre = document.createElement('div');
        sobre.className = 'shelf'
        const h210 = document.createElement('h4');
        sobre.innerHTML = `<p>${sobreData[0].sobre.replace(/\n/g, '<br>')}</p>`;
        sobre.appendChild(h210);
        mainContent.appendChild(sobre);

        const skills = document.createElement('div');
        const h21 = document.createElement('h4');
        skills.innerHTML = '<h1>Habilidades</h1>';
        skills.className = 'shelf'
        skillsData.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.innerHTML = `<h3>${skill.name}</h3><p>${skill.text}</p>`;
            skills.appendChild(skillItem);
            skills.appendChild(h21);
        });
        mainContent.appendChild(skills);

        // const services = document.createElement('div');
        // services.innerHTML = '<h2>Services</h2>';
        // servicesData.forEach(service => {
        //     const serviceItem = document.createElement('div');
        //     serviceItem.innerHTML = `
        //         <img src="${service.imageSrc}" alt="${service.altText}" width="40px">
        //         <h3>${service.title}</h3>
        //         <p>${service.description}</p>
        //     `;
        //     services.appendChild(serviceItem);
        // });
        // mainContent.appendChild(services);

        const experience = document.createElement('div');
        const h22 = document.createElement('h4');
        experience.innerHTML = '<h1>Experiência</h1>';
        experience.className = 'shelf'
        experienceData.forEach(exp => {
            const expItem = document.createElement('div');
            expItem.innerHTML = `<h3>${exp.title}</h3><p>${exp.duration}</p><p>${exp.description}</p>`;
            experience.appendChild(expItem);
            experience.appendChild(h22);
        });
        mainContent.appendChild(experience);

        const education = document.createElement('div');
        const h23 = document.createElement('h4');
        education.innerHTML = '<h1>Educação</h1>';
        education.className = 'shelf'
        educationData.forEach(edu => {
            const eduItem = document.createElement('div');
            eduItem.innerHTML = `<h3>${edu.title}</h3><p>${edu.duration}</p><p>${edu.description}</p>`;
            education.appendChild(eduItem);
            education.appendChild(h23);
        });
        mainContent.appendChild(education);
    })
    .catch(error => console.error('Error loading data:', error));
}
