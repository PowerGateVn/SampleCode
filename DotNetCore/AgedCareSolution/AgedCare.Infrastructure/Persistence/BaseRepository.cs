using AgedCare.Application.Constants;
using AgedCare.Application.Exceptions;
using AgedCare.Application.Utilities;
using AgedCare.Domain.Common;
using AgedCare.Infrastructure.Contexts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace AgedCare.Infrastructure.Persistence
{
    public class BaseRepository<T, TId> : IRepository<T, TId> where T : AudiTableEntity<TId>
    {
        protected readonly ApplicationDbContext Context;
        protected readonly DbSet<T> Entities;

        public BaseRepository(ApplicationDbContext context)
        {
            Context = context;
            Entities = Context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> condition, Expression<Func<T, int>> orderCondition, SortType sortType = SortType.Descending)
        {
            var query = Entities.AsQueryable();

            if (condition != null) query = query.Where(condition);

            if (orderCondition != null) query = sortType == SortType.Descending ? query.OrderByDescending(orderCondition) : query.OrderBy(orderCondition);

            return await query.ToListAsync();
        }

        public async Task<IEnumerable<T>> GetWithPagingAsync(
            Expression<Func<T, bool>> condition,
            Expression<Func<T, int>> orderCondition,
            SortType sortType = SortType.Descending,
            int page = AppConstant.PageIndex,
            int pageSize = AppConstant.PageSize)
        {
            var query = Entities.AsQueryable();
            var skip = (page - 1) * pageSize;

            if (skip < 0) skip = 0;

            if (condition != null) query = query.Where(condition);

            if (orderCondition != null) query = sortType == SortType.Descending ? query.OrderByDescending(orderCondition) : query.OrderBy(orderCondition);

            return await query.Skip(skip).Take(pageSize).ToListAsync();
        }

        public async Task<T> GetByIdAsync(TId id)
        {
            return await Entities.FindAsync(id);
        }

        public async Task<T> AddAsync(T entity)
        {
            Entities.Add(entity);
            await Context.SaveChangesAsync();

            return entity;
        }

        public async Task<T> UpdateAsync(T entity)
        {
            Context.Entry(entity).State = EntityState.Modified;
            await Context.SaveChangesAsync();

            return entity;
        }

        public async Task<bool> DeleteByIdAsync(TId id)
        {
            var entity = await Entities.FindAsync(id);
            
            if (entity == null) return false;

            Context.Entry(entity).State = EntityState.Deleted;
            await Context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteByIdsAsync(IEnumerable<TId> ids)
        {
            var entities = await Entities.Where(t => ids.Contains(t.Id)).ToListAsync();

            Entities.RemoveRange(entities);
            await Context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities)
        {
            using (var transaction = await Context.Database.BeginTransactionAsync())
            {
                try
                {
                    await Entities.AddRangeAsync(entities);
                    await Context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    return entities;
                }
                catch (Exception exception)
                {
                    await transaction.RollbackAsync();
                    throw new ExceptionCustom("AddRangeAsync", null, exception.Message, exception);
                }
            }
        }
    }
}
