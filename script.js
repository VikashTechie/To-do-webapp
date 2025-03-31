// script.js - Add this at the top of your existing script.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // Redirect to homepage if not logged in
        window.location.href = 'homepage1.html';
        return;
    }

    // Display current user's name
    document.getElementById('userNameDisplay').textContent = currentUser.username;

    // Logout functionality
    document.getElementById('logoutBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'homepage1.html';
    });

    // Rest of your existing task management code...
    // [Keep all your existing task management code here]
});
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with empty tasks array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentTaskId = null;
    let currentPriorityFilter = 'all'; // 'all', 'high', 'medium', 'low'
    
    // Initialize modals
    const addTaskModal = new bootstrap.Modal(document.getElementById('addTaskModal'));
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    const editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
    const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    const searchResultModal = new bootstrap.Modal(document.getElementById('searchResultModal'));

    // Initialize UI
    updateTaskStats();
    
    // Sidebar toggle functionality
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    
    document.getElementById('sidebarCollapse').addEventListener('click', function() {
        sidebar.classList.toggle('active');
        
        if (window.innerWidth > 768) {
            if (sidebar.classList.contains('active')) {
                content.style.marginLeft = '0';
            } else {
                content.style.marginLeft = '250px';
            }
        }
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            const sidebarToggle = document.getElementById('sidebarCollapse');
            
            if (!sidebar.contains(event.target) && 
                event.target !== sidebarToggle && 
                !sidebarToggle.contains(event.target)) {
                sidebar.classList.add('active');
                content.style.marginLeft = '0';
            }
        }
    });

    // Navigation between sections
    document.getElementById('dashboardLink').addEventListener('click', function(e) {
        e.preventDefault();
        showDashboardSection();
        setActiveNavItem(this);
    });
    
    document.getElementById('allTasksLink').addEventListener('click', function(e) {
        e.preventDefault();
        showAllTasksSection();
        setActiveNavItem(this);
    });
    
    document.getElementById('pendingTasksLink').addEventListener('click', function(e) {
        e.preventDefault();
        showPendingTasksSection();
        setActiveNavItem(this);
    });
    
    document.getElementById('completedTasksLink').addEventListener('click', function(e) {
        e.preventDefault();
        showCompletedTasksSection();
        setActiveNavItem(this);
    });
    
    document.getElementById('priorityTasksLink').addEventListener('click', function(e) {
        e.preventDefault();
        showPriorityTasksSection();
        setActiveNavItem(this);
    });
    
    // Priority filter buttons
    document.getElementById('showHighPriority').addEventListener('click', function() {
        currentPriorityFilter = 'high';
        renderPriorityTasksTable();
    });
    
    document.getElementById('showMediumPriority').addEventListener('click', function() {
        currentPriorityFilter = 'medium';
        renderPriorityTasksTable();
    });
    
    document.getElementById('showLowPriority').addEventListener('click', function() {
        currentPriorityFilter = 'low';
        renderPriorityTasksTable();
    });
    
    function showDashboardSection() {
        document.getElementById('dashboardSection').style.display = 'block';
        document.getElementById('allTasksSection').style.display = 'none';
        document.getElementById('pendingTasksSection').style.display = 'none';
        document.getElementById('completedTasksSection').style.display = 'none';
        document.getElementById('priorityTasksSection').style.display = 'none';
    }
    
    function showAllTasksSection() {
        document.getElementById('dashboardSection').style.display = 'none';
        document.getElementById('allTasksSection').style.display = 'block';
        document.getElementById('pendingTasksSection').style.display = 'none';
        document.getElementById('completedTasksSection').style.display = 'none';
        document.getElementById('priorityTasksSection').style.display = 'none';
        renderTasksTable();
    }
    
    function showPendingTasksSection() {
        document.getElementById('dashboardSection').style.display = 'none';
        document.getElementById('allTasksSection').style.display = 'none';
        document.getElementById('pendingTasksSection').style.display = 'block';
        document.getElementById('completedTasksSection').style.display = 'none';
        document.getElementById('priorityTasksSection').style.display = 'none';
        renderPendingTasksTable();
    }
    
    function showCompletedTasksSection() {
        document.getElementById('dashboardSection').style.display = 'none';
        document.getElementById('allTasksSection').style.display = 'none';
        document.getElementById('pendingTasksSection').style.display = 'none';
        document.getElementById('completedTasksSection').style.display = 'block';
        document.getElementById('priorityTasksSection').style.display = 'none';
        renderCompletedTasksTable();
    }
    
    function showPriorityTasksSection() {
        document.getElementById('dashboardSection').style.display = 'none';
        document.getElementById('allTasksSection').style.display = 'none';
        document.getElementById('pendingTasksSection').style.display = 'none';
        document.getElementById('completedTasksSection').style.display = 'none';
        document.getElementById('priorityTasksSection').style.display = 'block';
        currentPriorityFilter = 'all';
        renderPriorityTasksTable();
    }
    
    function setActiveNavItem(clickedItem) {
        document.querySelectorAll('#sidebar ul li').forEach(item => {
            item.classList.remove('active');
        });
        clickedItem.parentElement.classList.add('active');
    }

    // Render tasks tables
    function renderTasksTable() {
        const tableBody = document.getElementById('tasksTableBody');
        tableBody.innerHTML = '';
        
        if (tasks.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-muted">
                        <i class="fas fa-tasks fa-2x mb-3"></i>
                        <p>No tasks found. Add your first task!</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.title}</td>
                <td>${task.description || '-'}</td>
                <td>${task.dueDate ? formatDate(task.dueDate) : '-'}</td>
                <td><span class="priority-badge priority-${task.priority}">${task.priority}</span></td>
                <td><span class="status-badge status-${task.status}">${task.status}</span></td>
                <td>
                    <div class="d-flex">
                        <div class="action-btn edit-btn" data-id="${task.id}">
                            <i class="fas fa-edit"></i>
                        </div>
                        <div class="action-btn delete-btn" data-id="${task.id}">
                            <i class="fas fa-trash-alt"></i>
                        </div>
                        ${task.status === 'pending' ? `
                        <div class="action-btn complete-btn" data-id="${task.id}">
                            <i class="fas fa-check"></i>
                        </div>
                        ` : `
                        <div class="action-btn incomplete-btn" data-id="${task.id}">
                            <i class="fas fa-undo"></i>
                        </div>
                        `}
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        addActionButtonListeners();
    }
    
    function renderPendingTasksTable() {
        const tableBody = document.getElementById('pendingTasksTableBody');
        tableBody.innerHTML = '';
        
        const pendingTasks = tasks.filter(task => task.status === "pending");
        
        if (pendingTasks.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4 text-muted">
                        <i class="fas fa-hourglass-half fa-2x mb-3"></i>
                        <p>No pending tasks found.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        pendingTasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.title}</td>
                <td>${task.description || '-'}</td>
                <td>${task.dueDate ? formatDate(task.dueDate) : '-'}</td>
                <td><span class="priority-badge priority-${task.priority}">${task.priority}</span></td>
                <td>
                    <div class="d-flex">
                        <div class="action-btn edit-btn" data-id="${task.id}">
                            <i class="fas fa-edit"></i>
                        </div>
                        <div class="action-btn delete-btn" data-id="${task.id}">
                            <i class="fas fa-trash-alt"></i>
                        </div>
                        <div class="action-btn complete-btn" data-id="${task.id}">
                            <i class="fas fa-check"></i>
                        </div>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        addActionButtonListeners();
    }
    
    function renderCompletedTasksTable() {
        const tableBody = document.getElementById('completedTasksTableBody');
        tableBody.innerHTML = '';
        
        const completedTasks = tasks.filter(task => task.status === "completed");
        
        if (completedTasks.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4 text-muted">
                        <i class="fas fa-check-circle fa-2x mb-3"></i>
                        <p>No completed tasks found.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        completedTasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.title}</td>
                <td>${task.description || '-'}</td>
                <td>${task.dueDate ? formatDate(task.dueDate) : '-'}</td>
                <td><span class="priority-badge priority-${task.priority}">${task.priority}</span></td>
                <td>${formatDate(task.updatedAt || task.createdAt)}</td>
                <td>
                    <div class="d-flex">
                        <div class="action-btn edit-btn" data-id="${task.id}">
                            <i class="fas fa-edit"></i>
                        </div>
                        <div class="action-btn delete-btn" data-id="${task.id}">
                            <i class="fas fa-trash-alt"></i>
                        </div>
                        <div class="action-btn incomplete-btn" data-id="${task.id}">
                            <i class="fas fa-undo"></i>
                        </div>
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        addActionButtonListeners();
    }
    
    function renderPriorityTasksTable() {
        const tableBody = document.getElementById('priorityTasksTableBody');
        tableBody.innerHTML = '';
        
        let priorityTasks = tasks;
        
        if (currentPriorityFilter !== 'all') {
            priorityTasks = tasks.filter(task => task.priority === currentPriorityFilter);
        }
        
        if (priorityTasks.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4 text-muted">
                        <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
                        <p>No ${currentPriorityFilter === 'all' ? '' : currentPriorityFilter} priority tasks found.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        priorityTasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.title}</td>
                <td>${task.description || '-'}</td>
                <td>${task.dueDate ? formatDate(task.dueDate) : '-'}</td>
                <td><span class="status-badge status-${task.status}">${task.status}</span></td>
                <td>
                    <div class="d-flex">
                        <div class="action-btn edit-btn" data-id="${task.id}">
                            <i class="fas fa-edit"></i>
                        </div>
                        <div class="action-btn delete-btn" data-id="${task.id}">
                            <i class="fas fa-trash-alt"></i>
                        </div>
                        ${task.status === 'pending' ? `
                        <div class="action-btn complete-btn" data-id="${task.id}">
                            <i class="fas fa-check"></i>
                        </div>
                        ` : `
                        <div class="action-btn incomplete-btn" data-id="${task.id}">
                            <i class="fas fa-undo"></i>
                        </div>
                        `}
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        addActionButtonListeners();
    }
    
    function addActionButtonListeners() {
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const taskId = parseInt(this.getAttribute('data-id'));
                openEditModal(taskId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const taskId = parseInt(this.getAttribute('data-id'));
                openDeleteModal(taskId);
            });
        });
        
        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const taskId = parseInt(this.getAttribute('data-id'));
                markTaskAsComplete(taskId);
            });
        });
        
        document.querySelectorAll('.incomplete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const taskId = parseInt(this.getAttribute('data-id'));
                markTaskAsIncomplete(taskId);
            });
        });
    }
    
    function formatDate(dateString) {
        if (!dateString) return '-';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    function openEditModal(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        document.getElementById('editTaskId').value = task.id;
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDescription').value = task.description || '';
        document.getElementById('editTaskDueDate').value = task.dueDate || '';
        
        // Set priority
        document.querySelector(`input[name="editTaskPriority"][value="${task.priority}"]`).checked = true;
        
        // Set status
        document.querySelector(`input[name="editTaskStatus"][value="${task.status}"]`).checked = true;
        
        editTaskModal.show();
    }
    
    function openDeleteModal(taskId) {
        currentTaskId = taskId;
        deleteConfirmModal.show();
    }

    // Add Task button functionality
    document.getElementById('addTaskBtn').addEventListener('click', function() {
        openAddTaskModal();
    });
    
    document.getElementById('addNewTaskBtn').addEventListener('click', function() {
        openAddTaskModal();
    });
    
    document.getElementById('addPendingTaskBtn').addEventListener('click', function() {
        openAddTaskModal();
    });
    
    function openAddTaskModal() {
        // Reset form
        document.getElementById('taskForm').reset();
        // Set default status to pending
        document.getElementById('statusPending').checked = true;
        // Set default priority to medium
        document.getElementById('priorityMedium').checked = true;
        // Show modal
        addTaskModal.show();
    }

    // Save Task button functionality
    document.getElementById('saveTaskBtn').addEventListener('click', function() {
        // Get form values
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const priority = document.querySelector('input[name="taskPriority"]:checked').value;
        const status = document.querySelector('input[name="taskStatus"]:checked').value;

        // Validate title
        if (!title) {
            alert('Title is required');
            return;
        }

        // Create new task
        const newTask = {
            id: tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1,
            title,
            description,
            dueDate,
            priority,
            status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Add to tasks array
        tasks.push(newTask);
        
        // Save to localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Close add task modal
        addTaskModal.hide();
        
        // Show success modal
        showSuccessMessage('Task Added Successfully!', 'Your task has been added to the list.');
        
        // Update UI
        updateUIAfterChange();
    });

    // Update task button
    document.getElementById('updateTaskBtn').addEventListener('click', function() {
        const taskId = parseInt(document.getElementById('editTaskId').value);
        const title = document.getElementById('editTaskTitle').value;
        const description = document.getElementById('editTaskDescription').value;
        const dueDate = document.getElementById('editTaskDueDate').value;
        const priority = document.querySelector('input[name="editTaskPriority"]:checked').value;
        const status = document.querySelector('input[name="editTaskStatus"]:checked').value;
        
        if (!title) {
            alert('Title is required');
            return;
        }
        
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                title,
                description,
                dueDate,
                priority,
                status,
                updatedAt: new Date().toISOString()
            };
            
            localStorage.setItem('tasks', JSON.stringify(tasks));
            editTaskModal.hide();
            
            // Show success message
            showSuccessMessage('Task Updated Successfully!', 'Your task has been updated.');
            
            // Update UI
            updateUIAfterChange();
        }
    });
    
    // Confirm delete button
    document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
        tasks = tasks.filter(task => task.id !== currentTaskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        deleteConfirmModal.hide();
        
        // Show success message
        showSuccessMessage('Task Deleted!', 'Your task has been removed.');
        
        // Update UI
        updateUIAfterChange();
    });
    
    function markTaskAsComplete(taskId) {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = "completed";
            tasks[taskIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // Update UI
            updateUIAfterChange();
            
            // Show success message
            showSuccessMessage('Task Completed!', 'The task has been marked as completed.');
        }
    }
    
    function markTaskAsIncomplete(taskId) {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = "pending";
            tasks[taskIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // Update UI
            updateUIAfterChange();
            
            // Show success message
            showSuccessMessage('Task Marked as Pending!', 'The task has been marked as pending.');
        }
    }
    
    function updateUIAfterChange() {
        updateTaskStats();
        
        // Refresh the current view
        if (document.getElementById('allTasksSection').style.display === 'block') {
            renderTasksTable();
        } else if (document.getElementById('pendingTasksSection').style.display === 'block') {
            renderPendingTasksTable();
        } else if (document.getElementById('completedTasksSection').style.display === 'block') {
            renderCompletedTasksTable();
        } else if (document.getElementById('priorityTasksSection').style.display === 'block') {
            renderPriorityTasksTable();
        }
    }
    
    function showSuccessMessage(title, message) {
        document.getElementById('successTitle').textContent = title;
        document.getElementById('successMessage').textContent = message;
        setTimeout(() => {
            successModal.show();
        }, 300);
    }

    // Function to update task statistics
    function updateTaskStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === "completed").length;
        const pendingTasks = totalTasks - completedTasks;
        const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const pendingPercentage = totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0;
        
        // Update DOM elements
        animateValue('totalTasks', parseInt(document.getElementById('totalTasks').textContent) || 0, totalTasks, 500);
        animateValue('pendingTasks', parseInt(document.getElementById('pendingTasks').textContent) || 0, pendingTasks, 500);
        animateValue('completedTasks', parseInt(document.getElementById('completedTasks').textContent) || 0, completedTasks, 500);
        
        // Update progress bars
        document.querySelector('.pending-tasks .progress-bar').style.width = `${pendingPercentage}%`;
        document.querySelector('.completed-tasks .progress-bar').style.width = `${completionPercentage}%`;
    }

    // Function to animate number counting
    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Search functionality
    document.getElementById('searchButton').addEventListener('click', function() {
        performSearch(document.getElementById('searchInput').value);
    });
    
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
    
    function performSearch(query) {
        const searchTerm = query.trim().toLowerCase();
        
        if (searchTerm === '') {
            alert('Please enter a search term');
            return;
        }
        
        const searchResults = tasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm) || 
            (task.description && task.description.toLowerCase().includes(searchTerm))
        );
        
        displaySearchResults(searchResults, searchTerm);
    }
    
    function displaySearchResults(results, searchTerm) {
        const resultContent = document.getElementById('searchResultContent');
        resultContent.innerHTML = '';
        
        if (results.length === 0) {
            resultContent.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-search fa-3x mb-3 text-muted"></i>
                    <h5>No tasks found</h5>
                    <p>No tasks match your search for "${searchTerm}"</p>
                </div>
            `;
        } else {
            results.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = 'task-details mb-3';
                taskElement.innerHTML = `
                    <h6>${task.title}</h6>
                    <p><strong>Description:</strong> ${task.description || 'No description'}</p>
                    <p><strong>Due Date:</strong> ${task.dueDate ? formatDate(task.dueDate) : 'No due date'}</p>
                    <p><strong>Priority:</strong> <span class="priority-badge priority-${task.priority}">${task.priority}</span></p>
                    <p><strong>Status:</strong> <span class="status-badge status-${task.status}">${task.status}</span></p>
                    <p><strong>Created:</strong> ${formatDate(task.createdAt)}</p>
                    ${task.updatedAt ? `<p><strong>Last Updated:</strong> ${formatDate(task.updatedAt)}</p>` : ''}
                    <div class="d-flex mt-2">
                        <button class="btn btn-sm btn-outline-primary me-2 edit-from-search" data-id="${task.id}">
                            <i class="fas fa-edit me-1"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-from-search" data-id="${task.id}">
                            <i class="fas fa-trash-alt me-1"></i> Delete
                        </button>
                    </div>
                `;
                resultContent.appendChild(taskElement);
            });
            
            // Add event listeners to buttons in search results
            document.querySelectorAll('.edit-from-search').forEach(btn => {
                btn.addEventListener('click', function() {
                    const taskId = parseInt(this.getAttribute('data-id'));
                    searchResultModal.hide();
                    setTimeout(() => {
                        openEditModal(taskId);
                    }, 300);
                });
            });
            
            document.querySelectorAll('.delete-from-search').forEach(btn => {
                btn.addEventListener('click', function() {
                    const taskId = parseInt(this.getAttribute('data-id'));
                    searchResultModal.hide();
                    setTimeout(() => {
                        openDeleteModal(taskId);
                    }, 300);
                });
            });
        }
        
        searchResultModal.show();
    }
    
    // Refresh tables when modals are closed
    successModal._element.addEventListener('hidden.bs.modal', function() {
        updateUIAfterChange();
    });
    
    deleteConfirmModal._element.addEventListener('hidden.bs.modal', function() {
        updateUIAfterChange();
    });
    
    editTaskModal._element.addEventListener('hidden.bs.modal', function() {
        updateUIAfterChange();
    });
});

