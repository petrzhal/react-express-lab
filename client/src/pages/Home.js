import React, { Component } from 'react';
import ExhibitCard from '../components/ExhibitCard.js';
import ExhibitionCard from '../components/ExhibitionCard.js';
import BitcoinPrice from '../components/BitcoinPrice.js'
import Generalize from '../components/Generalize.js';
import './Home.css'; 

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exhibits: [],
            exhibitions: [],
            loading: true,
            error: null,
        };
    }

    async fetchData() {
        try {
            const responseExhibits = await fetch('http://localhost:5000/api/exhibits');
            const responseExhibitions = await fetch('http://localhost:5000/api/exhibitions');

            if (!responseExhibits.ok || !responseExhibitions.ok) {
                throw new Error('Не удалось загрузить данные');
            }

            const exhibitsData = await responseExhibits.json();
            const exhibitionsData = await responseExhibitions.json();

            this.setState({
                exhibits: exhibitsData,
                exhibitions: exhibitionsData,
                loading: false,
                error: null,
            });
        } catch (error) {
            this.setState({
                loading: false,
                error: error.message,
            });
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    render() {
        const { exhibits, exhibitions, loading, error } = this.state;

        if (loading) {
            return <div className="loading">Загрузка...</div>;
        }

        if (error) {
            return <div className="error">Ошибка: {error}</div>;
        }

        return (
            <div className="home">
                <BitcoinPrice/>
                <Generalize/>
                <h2 className="main-title">Добро пожаловать в музей</h2>
                <p>Откройте мир истории и культуры.</p>
                <div className="section">
                    <h3>Выставки</h3>
                    <div className="exhibit-cards-container two-rows">
                        {exhibitions.slice(0, 4).map((exhibition) => (
                            <ExhibitionCard key={exhibition._id} exhibition={exhibition} />
                        ))}
                    </div>
                </div>

                <div className="section">
                    <h3>Экспонаты</h3>
                    <div className="exhibit-cards-container two-rows">
                        {exhibits.slice(0, 4).map((exhibit) => (
                            <ExhibitCard key={exhibit._id} exhibit={exhibit} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
