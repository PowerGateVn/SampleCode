#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["AgedCare.API/AgedCare.API.csproj", "AgedCare.API/"]
COPY ["AgedCare.Application/AgedCare.Application.csproj", "AgedCare.Application/"]
COPY ["AgedCare.Domain/AgedCare.Domain.csproj", "AgedCare.Domain/"]
COPY ["AgedCare.Infrastructure/AgedCare.Infrastructure.csproj", "AgedCare.Infrastructure/"]
RUN dotnet restore "AgedCare.API/AgedCare.API.csproj"
COPY . .
WORKDIR "/src/AgedCare.API"
RUN dotnet build "AgedCare.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AgedCare.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AgedCare.API.dll"]