/**
 * Класс UI отвечает за взаимодействие с пользовательским интерфейсом
 */
class UI {
    constructor() {
        this.taskForm = document.getElementById('taskForm');
        this.taskTitleInput = document.getElementById('taskTitle');
        this.taskPrioritySelect = document.getElementById('taskPriority');
        this.taskDeadlineInput = document.getElementById('taskDeadline');
        this.taskTableBody = document.getElementById('taskTableBody');
        this.taskSearchInput = document.getElementById('taskSearch');
        this.filterPrioritySelect = document.getElementById('filterPriority');
        this.totalTasksSpan = document.getElementById('totalTasks');
        this.completedTasksSpan = document.getElementById('completedTasks');
        this.confirmModal = document.getElementById('confirmModal');
        this.confirmDeleteBtn = document.getElementById('confirmDelete');
        this.cancelDeleteBtn = document.getElementById('cancelDelete');

        // Устанавливаем минимальную дату - сегодня
        const today = new Date().toISOString().split('T')[0];
        this.taskDeadlineInput.min = today;

        this._setupEventListeners();
    }

    /**
     * Настраивает обработчики событий
     * @private
     */
    _setupEventListeners() {
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.onTaskSubmit();
        });

        this.taskSearchInput.addEventListener('input', () => {
            this.onFilterChange();
        });

        this.filterPrioritySelect.addEventListener('change', () => {
            this.onFilterChange();
        });

        this.confirmDeleteBtn.addEventListener('click', () => {
            this.onConfirmDelete();
        });

        this.cancelDeleteBtn.addEventListener('click', () => {
            this.hideModal();
        });
    }

    /**
     * Отрисовывает список задач
     * @param {Task[]} tasks - Массив задач для отображения
     */
    renderTasks(tasks) {
        this.taskTableBody.innerHTML = '';

        if (tasks.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" class="no-tasks">Задачи не найдены</td>`;
            this.taskTableBody.appendChild(row);
            return;
        }

        tasks.forEach(task => {
            const row = document.createElement('tr');
            if (task.isOverdue() && !task.completed) {
                row.classList.add('overdue');
            }

            row.innerHTML = `
                <td>${task.title}</td>
                <td class="priority-${task.priority}">${this._getPriorityLabel(task.priority)}</td>
                <td>${this._formatDate(task.deadline)}</td>
                <td class="status-${task.completed ? 'completed' : 'pending'}">
                    ${task.completed ? 'Выполнено' : 'В процессе'}
                </td>
                <td class="actions">
                    <button class="btn btn-small toggle-btn" data-id="${task.id}">
                        ${task.completed ? 'Возобновить' : 'Завершить'}
                    </button>
                    <button class="btn btn-small btn-danger delete-btn" data-id="${task.id}">Удалить</button>
                </td>
            `;

            this.taskTableBody.appendChild(row);
        });

        // Добавляем обработчики для кнопок в таблице
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.getAttribute('data-id');
                this.onToggleTask(taskId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = e.target.getAttribute('data-id');
                this.showDeleteConfirmation(taskId);
            });
        });

        // Обновляем статистику
        this.updateStatistics(tasks);
    }

    /**
     * Обновляет статистику задач
     * @param {Task[]} tasks - Массив задач
     */
    updateStatistics(tasks) {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;

        this.totalTasksSpan.textContent = total;
        this.completedTasksSpan.textContent = completed;
    }

    /**
     * Форматирует дату для отображения
     * @param {string} dateString - Строка с датой
     * @returns {string} Отформатированная дата
     * @private
     */
    _formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }

    /**
     * Возвращает читаемое название приоритета
     * @param {string} priority - Код приоритета
     * @returns {string} Название приоритета
     * @private
     */
    _getPriorityLabel(priority) {
        const labels = {
            low: 'Низкий',
            medium: 'Средний',
            high: 'Высокий'
        };
        return labels[priority] || priority;
    }

    /**
     * Показывает модальное окно подтверждения удаления
     * @param {string} taskId - ID задачи для удаления
     */
    showDeleteConfirmation(taskId) {
        this.currentTaskIdToDelete = taskId;
        this.confirmModal.style.display = 'flex';
    }

    /**
     * Скрывает модальное окно
     */
    hideModal() {
        this.confirmModal.style.display = 'none';
        this.currentTaskIdToDelete = null;
    }

    /**
     * Покажет сообщение пользователю
     * @param {string} message - Текст сообщения
     * @param {string} type - Тип сообщения (error, warning, success, info)
     */
    showAlert(message, type = 'info') {
        // Удаляем предыдущие сообщения
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        document.body.insertBefore(alert, document.body.firstChild);

        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    /**
     * Очищает форму ввода задачи
     */
    clearTaskForm() {
        this.taskForm.reset();
    }

    // Методы-заглушки для обработчиков событий
    onTaskSubmit() {}
    onFilterChange() {}
    onToggleTask(taskId) {}
    onConfirmDelete() {}
}