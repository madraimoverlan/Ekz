/**
 * Класс TaskManager управляет коллекцией задач
 */
class TaskManager {
    constructor() {
        this.tasks = [];
    }

    /**
     * Добавляет новую задачу
     * @param {string} title - Название задачи
     * @param {string} priority - Приоритет задачи
     * @param {string} deadline - Срок выполнения
     * @returns {Task} Созданная задача
     */
    addTask(title, priority, deadline) {
        const id = this._generateId();
        const task = new Task(id, title, priority, deadline);
        this.tasks.push(task);
        return task;
    }

    /**
     * Удаляет задачу по ID
     * @param {string} id - ID задачи для удаления
     * @returns {boolean} true, если задача была удалена
     */
    deleteTask(id) {
        const initialLength = this.tasks.length;
        this.tasks = this.tasks.filter(task => task.id !== id);
        return this.tasks.length !== initialLength;
    }

    /**
     * Находит задачу по ID
     * @param {string} id - ID задачи
     * @returns {Task|null} Найденная задача или null
     */
    getTaskById(id) {
        return this.tasks.find(task => task.id === id) || null;
    }

    /**
     * Переключает статус выполнения задачи
     * @param {string} id - ID задачи
     * @returns {boolean} true, если статус был изменен
     */
    toggleTaskCompletion(id) {
        const task = this.getTaskById(id);
        if (task) {
            task.toggleComplete();
            return true;
        }
        return false;
    }

    /**
     * Обновляет данные задачи
     * @param {string} id - ID задачи
     * @param {string} title - Новое название
     * @param {string} priority - Новый приоритет
     * @param {string} deadline - Новый срок
     * @returns {boolean} true, если задача была обновлена
     */
    updateTask(id, title, priority, deadline) {
        const task = this.getTaskById(id);
        if (task) {
            task.update(title, priority, deadline);
            return true;
        }
        return false;
    }

    /**
     * Возвращает все задачи
     * @returns {Task[]} Массив задач
     */
    getAllTasks() {
        return [...this.tasks];
    }

    /**
     * Фильтрует задачи по критериям
     * @param {string} searchTerm - Поисковый запрос
     * @param {string} priority - Приоритет для фильтрации
     * @returns {Task[]} Отфильтрованный массив задач
     */
    filterTasks(searchTerm = '', priority = 'all') {
        let filtered = this.tasks;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(term)
            );
        }

        if (priority !== 'all') {
            filtered = filtered.filter(task => task.priority === priority);
        }

        return filtered;
    }

    /**
     * Генерирует уникальный ID для задачи
     * @returns {string} Уникальный ID
     * @private
     */
    _generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}