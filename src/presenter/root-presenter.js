import EditFormView from '../view/edit-form-view.js';
import EventsListView from '../view/events-list-view.js';
import EventView from '../view/event-view.js';
import { render } from '../render.js';
import AddFormView from '../view/add-form-view.js';

export default class RootPresenter {
  #rootContainer;
  #eventsModel;
  #events;
  #eventList = new EventsListView();

  #renderEvent = (event) => {
    const eventComponent = new EventView(event);
    const eventEditComponent = new EditFormView(event);

    const eventToEdit = () => {
      this.#eventList.element.replaceChild(eventEditComponent.element, eventComponent.element);
    };

    const editToEvent = () => {
      this.#eventList.element.replaceChild(eventComponent.element, eventEditComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        editToEvent();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    eventComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      eventToEdit();
      document.addEventListener('keydown', onEscKeyDown);
    });

    eventEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      editToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    eventEditComponent.element.querySelector('.event__save-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      editToEvent();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(eventComponent, this.#eventList.element);
  };

  init(rootContainer, eventsModel) {
    this.#rootContainer = rootContainer;
    this.#eventsModel = eventsModel;
    this.#events = [...this.#eventsModel.events];

    render(this.#eventList, this.#rootContainer);
    // render(new AddFormView(this.#events[0]), this.#eventList.element);

    this.#events.forEach((event) => this.#renderEvent(event));
  }
}
