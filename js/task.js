/**
 * Класс Task представляет сущность задачи
 */
class Task {
    /**
     * Создает экземпляр Task
     * @param {string} id - Уникальный идентификатор задачи
     * @param {string} title - Название задачи
     * @param {string} priority - Приоритет задачи (low, medium, high)
     * @param {string} deadline - Срок выполнения задачи (строка в формате YYYY-MM-DD)
     * @param {boolean} [completed=false] - Статус выполнения задачи
     */
    constructor(id, title, priority, deadline, completed = false) {
        this.id = id;
        this.title = title;
        this.priority = priority;
        this.deadline = deadline;
        this.completed = completed;
        this.createdAt = new Date().toISOString();
    }

    /**
     * Переключает статус выполнения задачи
     */
    toggleComplete() {
        this.completed = !this.completed;
    }

    /**
     * Обновляет данные задачи
     * @param {string} title - Новое название задачи
     * @param {string} priority - Новый приоритет задачи
     * @param {string} deadline - Новый срок выполнения
     */
    update(title, priority, deadline) {
        this.title = title;
        this.priority = priority;
        this.deadline = deadline;
    }

    /**
     * Проверяет, просрочена ли задача
     * @returns {boolean} true, если задача просрочена
     */
    isOverdue() {
        if (this.completed) return false;
        const today = new Date();
        const deadlineDate = new Date(this.deadline);
        return deadlineDate < today;
    }
}