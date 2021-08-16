import { Component } from 'react';
import axios from 'axios';

export class GymForm extends Component {
    token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIyWmttRWhhYlpvMFhBIiwibmFtZSI6IlRyYWluZXIiLCJpYXQiOjE2MjkxMDc5NDIsImV4cCI6MTYyOTEzMzE0Mn0.Zx2wnrrfdAB6906lqpk7cFpXKSmry9xup0vWE19SGPM";

    state = {
        gyms: [],
        trainers: [],
        members: [],
        gym_id: null,
        trainer_id: null,
        member: []
    }

    constructor(props) {
        super(props)
    }

    list_gym() {
        axios.get(`http://13.232.102.139:9000/gym`, {
            headers: {
                Authorization: this.token
            }
        }).then(res => {
            if (!res.data.status) return
            const gyms = res.data.data;
            this.setState({ gyms })
        })
    }

    list_members() {
        axios.get(`http://13.232.102.139:9000/member/`, {
            headers: {
                Authorization: this.token
            }
        }).then(res => {
            if (!res.data.status) return
            const members = res.data.data;
            this.setState({ members })
        })
    }

    list_trainer(gym_user_id) {
        axios.get(`http://13.232.102.139:9000/trainer/gym/${gym_user_id}`, {
            headers: {
                Authorization: this.token
            }
        }).then(res => {
            if (!res.data.status) return
            const trainers = res.data.data;

            this.setState({ trainers })
        })
    }

    handleCheck(evt) {
        // evt.preventDefault();
        let member = this.state.member
        if (evt.target.checked)
            member.push(evt.target.value)
        else
            member.splice(member.indexOf(evt.target.value), 1)

        this.setState({ member })
    }

    handleGymChange(evt) {
        evt.preventDefault()
        this.setState({ gym_id: evt.target.value, trainer_id: null })
        this.list_trainer(evt.target.value)
    }

    handleTrainerChange(evt) {
        evt.preventDefault()
        this.setState({ trainer_id: evt.target.value })
    }

    handleSubmit(evt) {
        evt.preventDefault()
        axios({
            method: 'post',
            baseURL: 'http://13.232.102.139:9000',
            url: 'trainerandmember/add',
            headers: { Authorization: this.token },
            data: {
                gym_id: this.state.gym_id,
                member: this.state.member,
                trainer_id: this.state.trainer_id
            }
        }).then(res => {
            if (res.data.status) {
                this.resetForm.bind(this)
                return
            }

            alert(res.data.message)
        })
    }

    resetForm() {
        this.setState({
            gyms: [],
            trainers: [],
            members: [],
            gym_id: null,
            trainer_id: null,
            member: []
        })
    }

    componentDidMount() {
        this.list_gym()
        this.list_members()
    }

    render() {
        return <form onSubmit={this.handleSubmit.bind(this)}>
            {/* gym */}
            <div className="form-group" >
                <select className="form-control" onChange={this.handleGymChange.bind(this)}>
                    <option disabled value="" defaultValue>Select Gym</option>
                    {
                        this.state.gyms.map((item, index) => <option value={item.gym_id} key={index}>{item.user_id}</option>)
                    }
                </select>
            </div>

            {/* Trainer */}
            <div className="form-group" >
                <select className="form-control" onChange={this.handleTrainerChange.bind(this)}>
                    <option disabled value="" defaultValue>Select Trainer</option>
                    {
                        this.state.trainers.map((item, index) => <option value={item.uid} key={index}>{item.name}</option>)
                    }
                </select>
            </div>

            {/* members */}
            <div className="form-group" >
                {
                    this.state.members.map((item, index) => {
                        return <label key={index} className="mr-3">
                            <input type="checkbox" value={item.uid} onChange={this.handleCheck.bind(this)} defaultChecked={this.state.member.includes(item.uid)} /> {item.name}
                        </label>
                    })
                }
            </div>

            <button className="btn btn-outline-primary btn-sm">Submit</button>
        </form>
    }
}