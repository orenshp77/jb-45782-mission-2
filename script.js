$(document).ready(function() {
   
    function fetchAllCountries() {
        $.ajax({
            url: 'https://restcountries.com/v3.1/name/united',
            method: 'GET',
            success: function(data) {
                processCountries(data);
            },
            error: function(error) {
                showError('Error loading data');
            }
        });
    }

    function searchCountries(name) {
        $.ajax({
            url: 'https://restcountries.com/v3.1/name/' + name,
            method: 'GET',
            success: function(data) {
                processCountries(data);
            },
            error: function( status, error) {
                if (status === 404) {
                    showError('No countries found matching the search');
                } else {
                    showError('Error in search');
                }
            }
            
        });
    }

   
    function processCountries(countries) {
        let totalPopulation = 0;
        let regionCounts = {};
        let currencyCounts = {};

        countries.forEach(country => {
            totalPopulation += country.population || 0;
            
            if (country.region) {
                regionCounts[country.region] = (regionCounts[country.region] || 0) + 1;
            }

            if (country.currencies) {
                for (let currency in country.currencies) {
                    currencyCounts[currency] = (currencyCounts[currency] || 0) + 1;
                }
            }
        });

        const averagePopulation = Math.round(totalPopulation / countries.length);

        let html = `
            <div class="fade-in">
                <h2>Statistics</h2>
                <p>Total countries: ${countries.length}</p>
                <p>Total population: ${totalPopulation.toLocaleString()}</p>
                <p>Average population: ${averagePopulation.toLocaleString()}</p>

                <h3>Countries by Population</h3>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Country Name</th>
                            <th>Population</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${countries.map(country => `
                            <tr>
                                <td>${country.name.common}</td>
                                <td>${country.population.toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <h3>Countries by Region</h3>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Region</th>
                            <th>Number of Countries</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(regionCounts).map(([region, count]) => `
                            <tr>
                                <td>${region}</td>
                                <td>${count}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <h3>Currencies</h3>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Currency</th>
                            <th>Number of Countries</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(currencyCounts).map(([currency, count]) => `
                            <tr>
                                <td>${currency}</td>
                                <td>${count}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        $('#results').html(html);
    }

    function showError(message) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonText: 'OK'
        });
    }

    $('#searchBtn').on('click', function() {
        const searchTerm = $('#searchInput').val().trim();
        if (searchTerm) {
            searchCountries(searchTerm);
        } else {
            showError('Please enter a country name to search');
        }
    });

    $('#allBtn').on('click', function() {
        fetchAllCountries();
    });

    $('#searchInput').on('keyup', function(event) {
        if (event.key === 'Enter') {
            $('#searchBtn').click();
        }
    });
});