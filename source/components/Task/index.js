// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';

//Components
import Checkbox from '../../theme/assets/Checkbox';
import Remove from '../../theme/assets/Remove';
import Edit from '../../theme/assets/Edit';
import Star from '../../theme/assets/Star';

export default class Task extends PureComponent {
    state = {

    }

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _toggleTaskCompletedState = () => {
        const { completed } = this.props;

    };

    render () {
        const { completed, id, value, _removeTask } = this.props;

        return (
            <>
                <li className = { Styles.task }>
                    <div className = { Styles.content }>
                        <Checkbox
                            inlineBlock
                            checked = { completed }
                            className = { Styles.toggleTaskCompletedState }
                            color1 = '#3B8EF3'
                            color2 = 'white'
                            onClick = { this._toggleTaskCompletedState }
                        />
                        <input
                            disabled
                            maxLength="50"
                            type="text"
                            value= { value }
                        />
                    </div>

                    <div className = { Styles.actions }>
                        <Star
                            inlineBlock
                            checked = { true }
                            className = { Styles.toggleTaskFavoriteState }
                            color1 = '#3B8EF3'
                            color2 = '#000'
                        />
                        <Edit
                            inlineBlock
                            checked = { true }
                            className = { Styles.updateTaskMessageOnClick }
                            color1 = '#3B8EF3'
                            color2 = '#000'
                        />
                        <Remove
                            inlineBlock
                            className = { Styles.removeTask }
                            color1 = '#3B8EF3'
                            color2 = '#000'
                            onClick = { _removeTask( id ) }
                        />
                    </div>


                </li>
                <div className = { Styles.completed } >
                    <div className = { Styles.content } ></div>
                </div>
            </>
        );
    }
}
