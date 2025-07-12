<#-- Employee Card Template -->
<div class="employee-card" data-employee-id="${employee.id}">
    <div class="employee-card__header">
        <div class="employee-card__avatar">
            <#if employee.avatar??>
                <img src="${employee.avatar}" alt="${employee.firstName} ${employee.lastName}">
            <#else>
                <div class="employee-card__avatar-placeholder">
                    ${employee.firstName?substring(0, 1)?upper_case}${employee.lastName?substring(0, 1)?upper_case}
                </div>
            </#if>
        </div>
        
        <div class="employee-card__actions">
            <button class="employee-card__action" data-action="edit" data-employee-id="${employee.id}" title="Edit Employee">
                <i class="fas fa-edit"></i>
            </button>
            <button class="employee-card__action employee-card__action--danger" data-action="delete" data-employee-id="${employee.id}" title="Delete Employee">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    </div>
    
    <div class="employee-card__content">
        <h3 class="employee-card__name">${employee.firstName} ${employee.lastName}</h3>
        <p class="employee-card__email">${employee.email}</p>
        
        <div class="employee-card__info">
            <div class="employee-card__department">
                <i class="fas fa-building"></i>
                <span>${employee.department}</span>
            </div>
            <div class="employee-card__role">
                <i class="fas fa-user-tie"></i>
                <span>${employee.role}</span>
            </div>
        </div>
        
        <#if employee.phone??>
            <div class="employee-card__contact">
                <i class="fas fa-phone"></i>
                <span>${employee.phone}</span>
            </div>
        </#if>
    </div>
    
    <div class="employee-card__footer">
        <small class="employee-card__joined">
            <i class="fas fa-calendar"></i>
            Joined ${employee.joinDate?date?string("MMM yyyy")}
        </small>
    </div>
</div>