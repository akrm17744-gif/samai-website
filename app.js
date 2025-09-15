// Global variables
let schools = [];
let departments = [];
let linkedEntities = [];
let currentPage = 1;
const itemsPerPage = 10;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login page
    if (document.getElementById('coordinatorForm')) {
        initializeLoginPage();
    }
    
    // Check if we're on the index page
    if (document.getElementById('schoolsTable')) {
        initializeIndexPage();
    }
    
    // Check if we're on the achievement page
    if (document.getElementById('achievementsContainer')) {
        initializeAchievementPage();
    }
});

// Initialize login page
function initializeLoginPage() {
    loadDepartments();
    setupFormValidation();
    setupEventListeners();
}

// Initialize index page
function initializeIndexPage() {
    loadSchools();
    setupSearchFunctionality();
}

// Initialize achievement page
function initializeAchievementPage() {
    loadAchievements();
}

// Load departments for login page
async function loadDepartments() {
    try {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return;
        }
        
        const { data, error } = await window.supabaseClient
            .from('departments')
            .select('*')
            .order('name');
            
        if (error) {
            console.error('Error loading departments:', error);
            return;
        }
        
        departments = data || [];
        populateDepartmentSelect();
    } catch (error) {
        console.error('Error in loadDepartments:', error);
    }
}

// Populate department select dropdown
function populateDepartmentSelect() {
    const select = document.getElementById('department_id');
    if (!select) return;
    
    select.innerHTML = '<option value="">اختر القسم</option>';
    
    if (departments.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'لا توجد أقسام متاحة';
        option.disabled = true;
        select.appendChild(option);
        return;
    }
    
    // Categorize departments
    const availableDepartments = [];
    const linkedDepartments = [];
    const rejectedDepartments = [];
    
    departments.forEach(dept => {
        if (dept.can_link) {
            if (dept.coordinator_status === 'rejected') {
                rejectedDepartments.push(dept);
            } else {
                availableDepartments.push(dept);
            }
        } else {
            linkedDepartments.push(dept);
        }
    });
    
    // Add available departments first
    if (availableDepartments.length > 0) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = 'الأقسام المتاحة للربط';
        availableDepartments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.name || dept.full_name || 'قسم بدون اسم';
            option.className = 'text-success';
            optgroup.appendChild(option);
        });
        select.appendChild(optgroup);
    }
    
    // Add rejected departments
    if (rejectedDepartments.length > 0) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = 'الأقسام المرفوضة (يمكن إعادة طلبها)';
        rejectedDepartments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.name || dept.full_name || 'قسم بدون اسم';
            option.className = 'text-warning';
            optgroup.appendChild(option);
        });
        select.appendChild(optgroup);
    }
    
    // Add linked departments
    if (linkedDepartments.length > 0) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = 'الأقسام المرتبطة بمنسقين آخرين (غير متاحة)';
        linkedDepartments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.name || dept.full_name || 'قسم بدون اسم';
            option.disabled = true;
            option.className = 'text-danger';
            optgroup.appendChild(option);
        });
        select.appendChild(optgroup);
    }
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('coordinatorForm');
    if (!form) return;
    
    // Add input event listeners for real-time validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', updateSubmitButton);
        input.addEventListener('change', updateSubmitButton);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Coordinator type change
    const coordinatorType = document.getElementById('coordinator_type');
    if (coordinatorType) {
        coordinatorType.addEventListener('change', handleCoordinatorTypeChange);
    }
    
    // Department selection change
    const departmentSelect = document.getElementById('department_id');
    if (departmentSelect) {
        departmentSelect.addEventListener('change', handleDepartmentSelection);
    }
    
    // Form submission
    const form = document.getElementById('coordinatorForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
}

// Handle coordinator type change
function handleCoordinatorTypeChange() {
    const coordinatorType = document.getElementById('coordinator_type').value;
    const departmentSection = document.getElementById('department_selection');
    const entitiesSection = document.getElementById('entities_section');
    const schoolSearch = document.getElementById('school_search');
    
    if (coordinatorType === 'department') {
        departmentSection.style.display = 'block';
        entitiesSection.style.display = 'block';
        if (schoolSearch) schoolSearch.style.display = 'none';
    } else if (coordinatorType === 'school') {
        departmentSection.style.display = 'none';
        entitiesSection.style.display = 'block';
        if (schoolSearch) schoolSearch.style.display = 'block';
    } else {
        departmentSection.style.display = 'none';
        entitiesSection.style.display = 'none';
        if (schoolSearch) schoolSearch.style.display = 'none';
    }
    
    // Clear linked entities when changing type
    linkedEntities = [];
    updateEntityCount();
    displayLinkedEntities();
    updateSubmitButton();
}

// Handle department selection
function handleDepartmentSelection() {
    const departmentId = document.getElementById('department_id').value;
    if (!departmentId) return;
    
    const selectedDepartment = departments.find(dept => dept.id == departmentId);
    if (!selectedDepartment) {
        console.error('Selected department not found');
        return;
    }
    
    // Add department as linked entity
    const entity = {
        id: selectedDepartment.id,
        type: 'department',
        name: selectedDepartment.name,
        administration: selectedDepartment.administration,
        general_administration: selectedDepartment.general_administration,
        department: selectedDepartment.department,
        section: selectedDepartment.section,
        unit: selectedDepartment.unit,
        targets: {
            administrators: 5,
            teachers: 2,
            students: 0
        }
    };
    
    // Check for duplicates
    if (!linkedEntities.some(e => e.id === entity.id && e.type === entity.type)) {
        linkedEntities.push(entity);
        updateEntityCount();
        displayLinkedEntities();
        updateSubmitButton();
        
        // Reset selection
        document.getElementById('department_id').value = '';
        
        // Filter departments by selected administration
        filterDepartmentsBySelectedAdministration();
    } else {
        alert('هذا القسم مربوط بالفعل');
    }
}

// Filter departments by selected administration
function filterDepartmentsBySelectedAdministration() {
    if (linkedEntities.length === 0) {
        populateDepartmentSelect();
        return;
    }
    
    const firstEntity = linkedEntities[0];
    const firstDepartment = departments.find(dept => dept.id == firstEntity.id);
    
    if (!firstDepartment) {
        console.error('First department not found');
        return;
    }
    
    // Filter departments that belong to the same administration
    const filteredDepartments = departments.filter(dept => {
        // Avoid showing already linked departments
        if (linkedEntities.some(e => e.id === dept.id && e.type === 'department')) {
            return false;
        }
        
        // Check administration hierarchy
        if (firstDepartment.general_administration && dept.general_administration) {
            return firstDepartment.general_administration === dept.general_administration;
        } else if (firstDepartment.department && dept.department) {
            return firstDepartment.department === dept.department;
        } else {
            return firstDepartment.administration === dept.administration;
        }
    });
    
    // Populate filtered dropdown
    const select = document.getElementById('department_id');
    if (!select) return;
    
    select.innerHTML = '<option value="">اختر القسم</option>';
    
    if (filteredDepartments.length > 0) {
        // Categorize filtered departments
        const availableDepartments = [];
        const linkedDepartments = [];
        const rejectedDepartments = [];
        
        filteredDepartments.forEach(dept => {
            if (dept.can_link) {
                if (dept.coordinator_status === 'rejected') {
                    rejectedDepartments.push(dept);
                } else {
                    availableDepartments.push(dept);
                }
            } else {
                linkedDepartments.push(dept);
            }
        });
        
        // Add available departments
        if (availableDepartments.length > 0) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = 'الأقسام المتاحة للربط';
            availableDepartments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.id;
                option.textContent = dept.name || dept.full_name || 'قسم بدون اسم';
                option.className = 'text-success';
                optgroup.appendChild(option);
            });
            select.appendChild(optgroup);
        }
        
        // Add rejected departments
        if (rejectedDepartments.length > 0) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = 'الأقسام المرفوضة (يمكن إعادة طلبها)';
            rejectedDepartments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.id;
                option.textContent = dept.name || dept.full_name || 'قسم بدون اسم';
                option.className = 'text-warning';
                optgroup.appendChild(option);
            });
            select.appendChild(optgroup);
        }
        
        // Add linked departments
        if (linkedDepartments.length > 0) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = 'الأقسام المرتبطة بمنسقين آخرين (غير متاحة)';
            linkedDepartments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept.id;
                option.textContent = dept.name || dept.full_name || 'قسم بدون اسم';
                option.disabled = true;
                option.className = 'text-danger';
                optgroup.appendChild(option);
            });
            select.appendChild(optgroup);
        }
    }
}

// Search for entity (school)
async function searchEntity() {
    const statisticalNumber = document.getElementById('statistical_number').value.trim();
    if (!statisticalNumber) {
        alert('يرجى إدخال الرقم الإحصائي');
        return;
    }
    
    try {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return;
        }
        
        const { data, error } = await window.supabaseClient
            .from('schools')
            .select('*')
            .eq('statistical_number', statisticalNumber)
            .single();
            
        if (error) {
            console.error('Error searching for school:', error);
            displaySearchResult(null, 'لم يتم العثور على مدرسة بهذا الرقم الإحصائي');
            return;
        }
        
        displaySearchResult(data);
    } catch (error) {
        console.error('Error in searchEntity:', error);
        displaySearchResult(null, 'حدث خطأ أثناء البحث');
    }
}

// Display search result
function displaySearchResult(school, errorMessage = null) {
    const resultContainer = document.getElementById('searchResult');
    if (!resultContainer) return;
    
    if (errorMessage) {
        resultContainer.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${errorMessage}
            </div>
        `;
        resultContainer.style.display = 'block';
        return;
    }
    
    if (!school) {
        resultContainer.style.display = 'none';
        return;
    }
    
    resultContainer.innerHTML = `
        <div class="card search-result-card">
            <div class="card-header text-white">
                <h6 class="mb-0">
                    <i class="fas fa-school me-2"></i>
                    نتيجة البحث
                </h6>
            </div>
            <div class="card-body">
                <h6 class="card-title">${school.name}</h6>
                <div class="row">
                    <div class="col-md-6">
                        <p class="mb-1"><strong>الرقم الإحصائي:</strong> ${school.statistical_number}</p>
                        <p class="mb-1"><strong>المرحلة:</strong> ${school.education_level}</p>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-1"><strong>النوع:</strong> ${school.gender}</p>
                        <p class="mb-1"><strong>المنطقة:</strong> ${school.region}</p>
                    </div>
                </div>
                <button type="button" class="btn btn-primary btn-sm mt-2" onclick="addSchoolEntity('${school.id}')">
                    <i class="fas fa-plus me-1"></i>
                    إضافة المدرسة
                </button>
            </div>
        </div>
    `;
    resultContainer.style.display = 'block';
}

// Add school entity
function addSchoolEntity(schoolId) {
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized');
        return;
    }
    
    // Find school in the search result or fetch it
    // For now, we'll create a basic entity structure
    const entity = {
        id: schoolId,
        type: 'school',
        name: 'مدرسة', // This should be populated from the actual school data
        targets: {
            administrators: 1,
            teachers: 10,
            students: 200
        }
    };
    
    // Check for duplicates
    if (!linkedEntities.some(e => e.id === entity.id && e.type === entity.type)) {
        linkedEntities.push(entity);
        updateEntityCount();
        displayLinkedEntities();
        updateSubmitButton();
        
        // Clear search
        document.getElementById('statistical_number').value = '';
        document.getElementById('searchResult').style.display = 'none';
    } else {
        alert('هذه المدرسة مربوطة بالفعل');
    }
}

// Remove entity
function removeEntity(index) {
    linkedEntities.splice(index, 1);
    updateEntityCount();
    displayLinkedEntities();
    updateSubmitButton();
    
    // If no entities left, show all departments again
    if (linkedEntities.length === 0) {
        populateDepartmentSelect();
    }
}

// Update entity count
function updateEntityCount() {
    const count = linkedEntities.length;
    const countElement = document.getElementById('entityCount');
    if (countElement) {
        countElement.textContent = `${count}/4`;
    }
}

// Update submit button
function updateSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    if (!submitBtn) return;
    
    const coordinatorType = document.getElementById('coordinator_type').value;
    const civilRecord = document.getElementById('civil_record').value.trim();
    const name = document.getElementById('name').value.trim();
    const phoneNumber = document.getElementById('phone_number').value.trim();
    
    // Check basic fields
    let isValid = civilRecord && name && phoneNumber && coordinatorType;
    
    // Validate phone number
    if (phoneNumber) {
        const phonePattern = /^05[0-9]{8}$/;
        isValid = isValid && phonePattern.test(phoneNumber);
    }
    
    // Validate civil record
    if (civilRecord) {
        const civilPattern = /^[0-9]{10}$/;
        isValid = isValid && civilPattern.test(civilRecord);
    }
    
    // Check for linked entities
    if (coordinatorType === 'department' || coordinatorType === 'school') {
        isValid = isValid && linkedEntities.length > 0;
    }
    
    // Update button state
    submitBtn.disabled = !isValid;
    
    if (isValid) {
        submitBtn.innerHTML = '<i class="fas fa-user-plus me-1"></i> تسجيل المنسق';
        submitBtn.className = 'btn btn-primary';
    } else {
        submitBtn.innerHTML = '<i class="fas fa-user-plus me-1"></i> تسجيل المنسق';
        submitBtn.className = 'btn btn-secondary';
    }
}

// Display linked entities
function displayLinkedEntities() {
    const container = document.getElementById('linkedEntities');
    if (!container) return;
    
    if (linkedEntities.length === 0) {
        container.innerHTML = '<div class="text-center text-muted py-3">لا توجد جهات مربوطة</div>';
        return;
    }
    
    let html = '';
    linkedEntities.forEach((entity, index) => {
        const typeName = entity.type === 'school' ? 'مدرسة' : 'قسم';
        const typeClass = entity.type === 'school' ? 'bg-info' : 'bg-warning';
        const typeIcon = entity.type === 'school' ? 'school' : 'sitemap';
        
        html += `
            <div class="card mb-3 entity-card">
                <div class="card-header ${typeClass} text-white d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">
                        <i class="fas fa-${typeIcon} me-2"></i>
                        <span class="fw-bold">${typeName}:</span> ${entity.name}
                    </h6>
                    <button type="button" class="btn btn-light btn-sm" onclick="removeEntity(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <h6 class="mb-2">${entity.name}</h6>
                            ${entity.administration ? `<div class="text-muted small"><strong>الإدارة:</strong> ${entity.administration}</div>` : ''}
                        </div>
                        <div class="col-md-4">
                            <div class="target-box bg-light">
                                <h6 class="text-primary mb-2">الأهداف المطلوبة</h6>
                                <div class="row text-center">
                                    <div class="col-4">
                                        <div class="target-number text-primary">${entity.targets.administrators}</div>
                                        <small class="text-muted">إداريين</small>
                                    </div>
                                    <div class="col-4">
                                        <div class="target-number text-success">${entity.targets.teachers}</div>
                                        <small class="text-muted">معلمين</small>
                                    </div>
                                    <div class="col-4">
                                        <div class="target-number text-info">${entity.targets.students}</div>
                                        <small class="text-muted">طلاب</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Handle form submission
async function handleFormSubmission(event) {
    event.preventDefault();
    
    if (!window.supabaseClient) {
        alert('خطأ في الاتصال بقاعدة البيانات');
        return;
    }
    
    const formData = new FormData(event.target);
    const coordinatorData = {
        civil_record: formData.get('civil_record'),
        name: formData.get('name'),
        phone_number: formData.get('phone_number'),
        coordinator_type: formData.get('coordinator_type'),
        linked_entities: linkedEntities
    };
    
    try {
        const { data, error } = await window.supabaseClient
            .from('coordinators')
            .insert([coordinatorData]);
            
        if (error) {
            console.error('Error inserting coordinator:', error);
            alert('حدث خطأ أثناء تسجيل المنسق');
            return;
        }
        
        alert('تم تسجيل المنسق بنجاح');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error in form submission:', error);
        alert('حدث خطأ أثناء تسجيل المنسق');
    }
}

// Load schools for index page
async function loadSchools() {
    try {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return;
        }
        
        const { data, error } = await window.supabaseClient
            .from('schools')
            .select('*')
            .order('name');
            
        if (error) {
            console.error('Error loading schools:', error);
            return;
        }
        
        schools = data || [];
        displaySchools();
    } catch (error) {
        console.error('Error in loadSchools:', error);
    }
}

// Display schools
function displaySchools() {
    const tableBody = document.getElementById('schoolsTableBody');
    if (!tableBody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageSchools = schools.slice(startIndex, endIndex);
    
    if (pageSchools.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">لا توجد مدارس</td></tr>';
        return;
    }
    
    let html = '';
    pageSchools.forEach((school, index) => {
        html += `
            <tr>
                <td>${startIndex + index + 1}</td>
                <td>${school.name}</td>
                <td>${school.statistical_number}</td>
                <td>${school.education_level}</td>
                <td>${school.gender}</td>
                <td>${school.region}</td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
    updatePagination();
}

// Setup search functionality
function setupSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// Handle search
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        // Show all schools
        currentPage = 1;
        displaySchools();
        return;
    }
    
    // Filter schools based on search term
    const filteredSchools = schools.filter(school => 
        school.name.toLowerCase().includes(searchTerm) ||
        school.statistical_number.includes(searchTerm) ||
        school.education_level.toLowerCase().includes(searchTerm) ||
        school.gender.toLowerCase().includes(searchTerm) ||
        school.region.toLowerCase().includes(searchTerm)
    );
    
    // Update schools array temporarily for display
    const originalSchools = schools;
    schools = filteredSchools;
    currentPage = 1;
    displaySchools();
    schools = originalSchools;
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(schools.length / itemsPerPage);
    const paginationContainer = document.getElementById('pagination');
    
    if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }
    
    let html = '<nav><ul class="pagination justify-content-center">';
    
    // Previous button
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">السابق</a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }
    
    // Next button
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">التالي</a>
        </li>
    `;
    
    html += '</ul></nav>';
    paginationContainer.innerHTML = html;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(schools.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displaySchools();
}

// Load achievements for achievement page
async function loadAchievements() {
    try {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return;
        }
        
        const { data, error } = await window.supabaseClient
            .from('achievements')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error('Error loading achievements:', error);
            return;
        }
        
        displayAchievements(data || []);
    } catch (error) {
        console.error('Error in loadAchievements:', error);
    }
}

// Display achievements
function displayAchievements(achievements) {
    const container = document.getElementById('achievementsContainer');
    if (!container) return;
    
    if (achievements.length === 0) {
        container.innerHTML = '<div class="text-center text-muted py-5">لا توجد إنجازات</div>';
        return;
    }
    
    let html = '';
    achievements.forEach(achievement => {
        const progressPercentage = Math.min((achievement.current_value / achievement.target_value) * 100, 100);
        const statusClass = achievement.status === 'completed' ? 'success' : 
                           achievement.status === 'in_progress' ? 'warning' : 'info';
        
        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card achievement-card h-100">
                    <div class="card-body text-center">
                        <div class="achievement-icon-wrapper">
                            <i class="fas fa-trophy achievement-icon"></i>
                        </div>
                        <h5 class="achievement-title">${achievement.title}</h5>
                        <p class="achievement-description">${achievement.description}</p>
                        
                        <div class="achievement-progress">
                            <div class="progress">
                                <div class="progress-bar" style="width: ${progressPercentage}%"></div>
                            </div>
                            <small class="achievement-progress-text">
                                ${achievement.current_value} من ${achievement.target_value}
                            </small>
                        </div>
                        
                        <div class="achievement-status">
                            <span class="badge badge-${statusClass}">
                                ${achievement.status === 'completed' ? 'مكتمل' : 
                                  achievement.status === 'in_progress' ? 'قيد التنفيذ' : 'جديد'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Show login modal
function showLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
}

// Show registration modal
function showRegistrationModal() {
    window.location.href = 'login.html';
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const civilRecord = formData.get('civil_record');
    const phoneNumber = formData.get('phone_number');
    
    if (!window.supabaseClient) {
        alert('خطأ في الاتصال بقاعدة البيانات');
        return;
    }
    
    try {
        const { data, error } = await window.supabaseClient
            .from('coordinators')
            .select('*')
            .eq('civil_record', civilRecord)
            .eq('phone_number', phoneNumber)
            .single();
            
        if (error || !data) {
            alert('بيانات تسجيل الدخول غير صحيحة');
            return;
        }
        
        // Store coordinator data in session
        sessionStorage.setItem('coordinator', JSON.stringify(data));
        alert('تم تسجيل الدخول بنجاح');
        
        // Redirect to achievements page
        window.location.href = 'Achievement.html';
    } catch (error) {
        console.error('Error in login:', error);
        alert('حدث خطأ أثناء تسجيل الدخول');
    }
}

// Toggle instructions
function toggleInstructions() {
    const instructions = document.getElementById('searchInstructions');
    const icon = document.getElementById('toggleIcon');
    
    if (instructions) {
        if (instructions.style.display === 'none') {
            instructions.style.display = 'block';
            if (icon) icon.className = 'fas fa-chevron-up';
        } else {
            instructions.style.display = 'none';
            if (icon) icon.className = 'fas fa-chevron-down';
        }
    }
}

