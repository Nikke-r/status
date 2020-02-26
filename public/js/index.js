const url = 'https://status-niklas-r.herokuapp.com';
const contentDiv = document.getElementById('content');

const getPackages = async () => {
    try {
        const options = {
            method: 'GET',
        };
        const response = await fetch(url + '/packages', options);
        const toJSON = await response.json();
        packagesToArr(toJSON.packages);
    } catch (error) {
        console.log('getPackages error: ', error.message);
    }
};

const packagesToArr = (content) => {
    //Split all the packages
    const split = content.split('\n\n');

    //Sort the packages alphabetically
    const sort = split.sort();
    
    //Remove first item from the array since it is empty for some reason...
    sort.shift();

    //Get the package name, the description and the dependencies and push them to an array as an object
    const packageArr = [];
    sort.forEach(item => {
        const packageName = item.split(/[\s]/)[1];

        const startOfDesc = item.split('Description: ')[1].split('\n ');
        const endOfDesc = startOfDesc[startOfDesc.length - 1].split('\n')[0];
        startOfDesc.pop();
        const fullDesc = [...startOfDesc, endOfDesc];

        if (item.split('Depends: ')[1] !== undefined) {
            const dependencies = [];

            //Get rid of version numbers
            const partAfterDepends = item.split('Depends: ')[1];
            const onlyDepends = partAfterDepends.split('\n')[0];
            const individualDepends = onlyDepends.split(', ');
            
            for (let i = 0; i < individualDepends.length; i++) {
                //Check if the dependency has a version number
                if (individualDepends[i].split(' ')[1]) {
                    const dependencyName = individualDepends[i].split(' ')[0];
                    dependencies.push(dependencyName);
                } else {
                    dependencies.push(individualDepends[i])
                }
            }
            packageArr.push({
                name: packageName,
                dependencies: dependencies,
                description: fullDesc.join(' '),
            });
        } else {
            packageArr.push({
                name: packageName,
                description: fullDesc.join(' '),
            });
        }
    });

    //Find reversed dependencies and push them to separate array
    const reversedDeps = [];

    packageArr.forEach(package => {
        for (let i = 0; i < packageArr.length; i++) {
            if (package.dependencies !== undefined) {
                if (package.dependencies.includes(packageArr[i].name)) {
                    reversedDeps.push({
                        name: packageArr[i].name,
                        revDeps: package.name
                    });
                };
            };
        };
    });

    handleDOM(packageArr, reversedDeps);
};

const handleDOM = (packageArr, reversedDeps) => {
    packageArr.forEach(package => {
        //Create DOM elements
        const div = document.createElement('div');
        const h3 = document.createElement('h3');
        const table = document.createElement('table');
        const trh = document.createElement('tr');
        const trd = document.createElement('tr');
        const thDesc = document.createElement('th');
        const thDep = document.createElement('th');
        const thRevDep = document.createElement('th');
        const tdDesc = document.createElement('td');
        const tdDep = document.createElement('td');
        const tdRevDep = document.createElement('td');
        const ulDep = document.createElement('ul');
        const ulRevDep = document.createElement('ul');

        //Configure the elements

        //h3
        h3.innerHTML = package.name;
        h3.onclick = () => {
            table.className === 'infoHidden' ? table.className = 'infoVisible' : table.className = 'infoHidden'
        };

        //Div
        div.id = package.name;
        div.className = 'individualPackage';

        //Table
        table.className = 'infoHidden';

        //Table headers
        thDep.innerHTML = 'Dependencies';
        thDesc.innerHTML = 'Description';
        thRevDep.innerHTML ='Reverse Dependencies';

        //Table data 
        tdDesc.innerHTML = package.description;
        if (package.dependencies !== undefined) {
            package.dependencies.forEach(dependency => {
                const li = document.createElement('li');
                const a = document.createElement('a');
    
                a.innerHTML = dependency;
                a.href = '#' + dependency;
    
                li.appendChild(a);
                ulDep.appendChild(li);
            });
        };
        for (let i = 0; i < reversedDeps.length; i++) {
            if (reversedDeps[i].name === package.name) {
                const li = document.createElement('li');
                const a = document.createElement('a');

                a.innerHTML = reversedDeps[i].revDeps;
                a.href = '#' + reversedDeps[i].revDeps;

                li.appendChild(a);
                ulRevDep.appendChild(li);
            };
        };
        tdDesc.style.width = '50%';
        tdDep.style.width = '25%';
        tdRevDep.style.width = '25%';

        //Append
        tdDep.appendChild(ulDep);
        tdRevDep.appendChild(ulRevDep);
        trh.appendChild(thDesc);
        trh.appendChild(thDep);
        trh.appendChild(thRevDep);
        trd.appendChild(tdDesc);
        trd.appendChild(tdDep);
        trd.appendChild(tdRevDep);
        table.appendChild(trh);
        table.appendChild(trd);
        div.appendChild(h3);
        div.appendChild(table);
        contentDiv.appendChild(div);
    
    });
}

getPackages();