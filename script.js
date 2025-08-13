document.getElementById('searchBtn').addEventListener('click', searchClass);
document.getElementById('classInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') searchClass();
});

function searchClass() {
    const query = document.getElementById('classInput').value.trim();
    if (!query) return alert('Please enter a class name.');

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 'Searching...';

    fetch(`/.netlify/functions/search-class?name=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
            resultsDiv.innerHTML = '';
            if (data.length === 0) {
                resultsDiv.innerHTML = '<p>No results found.</p>';
            } else {
                data.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'result-item';
                    div.innerHTML = `<strong>${item.artifactId}</strong> - ${item.groupId} 
                                     <br/> <a href="${item.jarLink}" target="_blank">Download JAR</a>`;
                    resultsDiv.appendChild(div);
                });
            }
        })
        .catch(err => {
            console.error(err);
            resultsDiv.innerHTML = '<p>Error searching for class.</p>';
        });
}
