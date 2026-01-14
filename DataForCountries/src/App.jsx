import { useState, useEffect } from 'react'
import countriesService from './services/countries'

// Componente para o input de pesquisa
const Filter = ({ search, setSearch }) => (
  <div>
    find countries:{' '}
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
)

// Componente para mostrar detalhes de um país
const CountryDetails = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <p>Capital: {country.capital}</p>
    <p>Area: {country.area}</p>

    <h3>Languages:</h3>
    <ul>
      {Object.values(country.languages).map((lang) => (
        <li key={lang}>{lang}</li>
      ))}
    </ul>

    <img
      src={country.flags.png}
      alt={`Flag of ${country.name.common}`}
      width="150"
    />
  </div>
)

// Componente para mostrar lista de países
const CountryList = ({ countries }) => (
  <ul>
    {countries.map((c) => (
      <li key={c.name.common}>{c.name.common}</li>
    ))}
  </ul>
)

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  // 🔹 Fetch inicial da API
  useEffect(() => {
    countriesService.getAll().then((response) => setCountries(response.data))
  }, [])

  // 🔹 Filtrar países de acordo com o input
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  // 🔹 Lógica de exibição de resultados
  const renderCountries = () => {
    if (filteredCountries.length > 10) {
      return <p>Too many matches, specify another filter</p>
    }

    if (filteredCountries.length > 1) {
      return <CountryList countries={filteredCountries} />
    }

    if (filteredCountries.length === 1) {
      return <CountryDetails country={filteredCountries[0]} />
    }

    return <p>No matches</p>
  }

  return (
    <div>
      <Filter search={search} setSearch={setSearch} />
      {renderCountries()}
    </div>
  )
}

export default App

