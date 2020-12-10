import { LitElement, html } from "@polymer/lit-element";

import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-button";
import "@vaadin/vaadin-checkbox";
import "@vaadin/vaadin-radio-button/vaadin-radio-button";
import "@vaadin/vaadin-radio-button/vaadin-radio-group";

const VisibilityFilters = {
  SHOW_ALL: "All",
  SHOW_ACTIVE: "Active",
  SHOW_COMPLETED: "Completed"
};

class TodoView extends LitElement {
  static get properties() {
    return {
      onAdd: { type: Function },
      todos: { type: Array },
      filter: { type: String },
      task: { type: String }
    };
  }

  constructor() {
    super();
    this.todos = [
      { task: "one", complete: true },
      { task: "two", complete: false },
      { task: "three", complete: true }
    ];
    this.filter = VisibilityFilters.SHOW_ALL;
    this.task = "";
  }

  render() {
    return html`
      <div class="input-layout">
        
        <!-- Add Todo Component -->
        <add-todo .onAdd="${(task) => this.addTodo(task)}"></add-todo>
        
        <!-- Start of Todo List  -->
        <div class="todo-list">
          ${this.applyFilter(this.todos).map(todo =>
        html`
                <div class="todo-item">
                
                <!-- Todo Item Component -->
                  <todo-item 
                    .todo="${todo}" 
                    @on-toggle="${this.updateTodoStatus}">
                  </todo-item>
                </div>
              `
      )}
        </div>
        <!-- End of Todo List -->
      </div>

      <vaadin-radio-group
        value="${this.filter}"
        @value-changed="${this.onFilterChange}"
      >
        ${Object.values(VisibilityFilters).map(
        filter => html`
            <vaadin-radio-button value="${filter}"
              >${filter}</vaadin-radio-button
            >
          `
      )}
      </vaadin-radio-group>
    `;
  }

  onFilterChange(e) {
    this.filter = e.detail.value;
  }

  applyFilter(todos) {
    switch (this.filter) {
      case VisibilityFilters.SHOW_ACTIVE:
        return this.todos.filter(todo => !todo.complete);
      case VisibilityFilters.SHOW_COMPLETED:
        return this.todos.filter(todo => todo.complete);
      default:
        return todos;
    }
  }

  /**
   * Updates the modified TODO in an array.
   * @param {*} e 
   */
  updateTodoStatus(e) {
    const updatedTodo = e.detail.todo;
    this.todos = this.todos.map(todo =>
      updatedTodo === todo ? { ...updatedTodo } : todo
    );
  }

  /**
   * Adds new TODO to an array
   * @param {*} e 
   */
  addTodo(task) {
    if (task) {
      this.todos = [
        ...this.todos,
        {
          task: task,
          complete: false
        }
      ];
    }
  }
}

customElements.define("todo-view", TodoView);
