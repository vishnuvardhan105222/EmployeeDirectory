<#-- Employee List Template -->
<div class="employee-list">
    <div class="employee-list__header">
        <div class="employee-list__column">Name</div>
        <div class="employee-list__column">Department</div>
        <div class="employee-list__column">Role</div>
        <div class="employee-list__column">Contact</div>
        <div class="employee-list__column">Actions</div>
    </div>
    
    <div class="employee-list__body">
        <#list employees as employee>
            <div class="employee-list__row" data-employee-id="${employee.id}">
                <div class="employee-list__cell employee-list__cell--name">
                    <div class="employee-list__avatar">
                        <#if employee.avatar??>
                            <img src="${employee.avatar}" alt="${employee.firstName} ${employee.lastName}">
                        <#else>
                            <div class="employee-list__avatar-placeholder">
                                ${employee.firstName?substring(0, 1)?upper_case}${employee.lastName?substring(0, 1)?upper_case}
                            </div>
                        </#if>
                    </div>
                    <div class="employee-list__info">
                        <div class="employee-list__name">${employee.firstName} ${employee.lastName}</div>
                        <div class="employee-list__email">${employee.email}</div>
                    </div>
                </div>
                
                <div class="employee-list__cell employee-list__cell--department">
                    <span class="employee-list__badge employee-list__badge--${employee.department?lower_case}">
                        ${employee.department}
                    </span>
                </div>
                
                <div class="employee-list__cell employee-list__cell--role">
                    ${employee.role}
                </div>
                
                <div class="employee-list__cell employee-list__cell--contact">
                    <#if employee.phone??>
                        <div class="employee-list__phone">
                            <i class="fas fa-phone"></i>
                            ${employee.phone}
                        </div>
                    </#if>
                    <div class="employee-list__joined">
                        <i class="fas fa-calendar"></i>
                        ${employee.joinDate?date?string("MMM dd, yyyy")}
                    </div>
                </div>
                
                <div class="employee-list__cell employee-list__cell--actions">
                    <button class="employee-list__action" data-action="edit" data-employee-id="${employee.id}" title="Edit Employee">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="employee-list__action employee-list__action--danger" data-action="delete" data-employee-id="${employee.id}" title="Delete Employee">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </#list>
    </div>
</div>