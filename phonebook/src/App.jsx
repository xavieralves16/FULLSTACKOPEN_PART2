import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')

  // 🔹 FETCH inicial
  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  // 🔹 ADD ou UPDATE
  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      person => person.name === newName
    )

    // 👉 Caso o nome já exista → UPDATE
    if (existingPerson) {
      const ok = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
      if (!ok) return

      const updatedPerson = {
        ...existingPerson,
        number: newNumber
      }

      personService
        .update(existingPerson.id, updatedPerson)
        .then(response => {
          setPersons(
            persons.map(person =>
              person.id !== existingPerson.id
                ? person
                : response.data
            )
          )
          setNewName('')
          setNewNumber('')
        })

      return
    }

    // 👉 Caso novo contacto → CREATE
    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
  }

  // 🔹 DELETE
  const deletePerson = (id, name) => {
    const ok = window.confirm(`Delete ${name}?`)
    if (!ok) return

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  // 🔹 FILTRO
  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter search={search} setSearch={setSearch} />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />

      <h3>Numbers</h3>

      <Persons
        persons={personsToShow}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App






