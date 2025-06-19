/**
 * Главный класс приложения, связывающий TaskManager и UI
 */
class TaskApp {
    constructor() {
        this.taskManager = new TaskManager();
        this.ui = new UI();

        // Привязываем контекст для обработчиков событий
        this.ui.onTaskSubmit = this.handleTaskSubmit.bind(this);
        this.ui.onFilterChange = this.handleFilterChange.bind(this);
        this.ui.onToggleTask = this.handleToggleTask.bind(this);
        this.ui.onConfirmDelete = this.handleConfirmDelete.bind(this);

        // Загружаем тестовые данные (в реальном приложении здесь была бы загрузка из БД)
        this.loadSampleData();
        
        // Первоначальная отрисовка задач
        this.updateTaskList();
    }

    /**
     * Загружает тестовые данные
     */
    loadSampleData() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        this.taskManager.addTask(
            'Завершить проект ABC Corp', 
            'high', 
            tomorrow.toISOString().split('T')[0]
        );
        
        this.taskManager.addTask(
            'Подготовить отчет о продажах', 
            'medium', 
            nextWeek.toISOString().split('T')[0]
        );
        
        this.taskManager.addTask(
            'Обновить контакты клиентов', 
            'low', 
            today.toISOString().split('T')[0]
        );
    }

    /**
     * Обрабатывает отправку формы задачи
     */
    handleTaskSubmit() {
        const title = this.ui.taskTitleInput.value.trim();
        const priority = this.ui.taskPrioritySelect.value;
        const deadline = this.ui.taskDeadlineInput.value;

        // Валидация
        if (!title || !priority || !deadline) {
            this.ui.showAlert('Пожалуйста, заполните все поля формы', 'error');
            return;
        }

        try {
            this.taskManager.addTask(title, priority, deadline);
            this.ui.showAlert('Задача успешно добавлена', 'success');
            this.ui.clearTaskForm();
            this.updateTaskList();
        } catch (error) {
            this.ui.showAlert(`Ошибка при добавлении задачи: ${error.message}`, 'error');
            console.error(error);
        }
    }

    /**
     * Обрабатывает изменение фильтров
     */
    handleFilterChange() {
        this.updateTaskList();
    }

    /**
     * Обрабатывает переключение статуса задачи
     * @param {string} taskId - ID задачи
     */
    handleToggleTask(taskId) {
        const success = this.taskManager.toggleTaskCompletion(taskId);
        if (success) {
            this.updateTaskList();
            this.ui.showAlert('Статус задачи обновлен', 'info');
        } else {
            this.ui.showAlert('Не удалось изменить статус задачи', 'error');
        }
    }

    /**
     * Обрабатывает подтверждение удаления задачи
     */
    handleConfirmDelete() {
        if (this.ui.currentTaskIdToDelete) {
            const success = this.taskManager.deleteTask(this.ui.currentTaskIdToDelete);
            if (success) {
                this.ui.showAlert('Задача удалена', 'info');
                this.updateTaskList();
            } else {
                this.ui.showAlert('Не удалось удалить задачу', 'error');
            }
            this.ui.hideModal();
        }
    }

    /**
     * Обновляет список задач с учетом текущих фильтров
     */
    updateTaskList() {
        const searchTerm = this.ui.taskSearchInput.value.trim();
        const priorityFilter = this.ui.filterPrioritySelect.value;
        
        const filteredTasks = this.taskManager.filterTasks(searchTerm, priorityFilter);
        this.ui.renderTasks(filteredTasks);
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new TaskApp();
});