import React, { useEffect, useState } from 'react';
import { PeopleList } from './components/peopleList';
import { useFilter } from './hooks/Filter';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [data] = useState<Person[]>(peopleFromServer);
  const [error, setError] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [show, setShow] = useState(false);

  const filteredPeople = useFilter(data, query);

  useEffect(() => {
    // скрываем список после выбора
    if (selectedPerson && show) {
      setShow(false);
    }

    // показываем ошибку только когда dropdown открыт
    if (show && query.trim() !== '' && filteredPeople.length === 0) {
      setError(true);
    } else {
      setError(false);
    }
  }, [filteredPeople, query, selectedPerson, show]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectedPerson(null);
    setShow(true);
  };

  const handleSelect = (person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name); // подставляем имя в input
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${show ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setShow(true)}
            />
          </div>

          {show && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                <PeopleList people={filteredPeople} onSelect={handleSelect} />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div
            className="
              notification
              is-danger
              is-light
              mt-3
              is-align-self-flex-start
            "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
