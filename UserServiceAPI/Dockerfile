# Imagen base runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Imagen build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copia SOLO el csproj primero (mejor cache)
COPY ["UserServiceAPI/UserServiceAPI.csproj", "UserServiceAPI/"]
RUN dotnet restore "UserServiceAPI/UserServiceAPI.csproj"

# Copia todo el código
COPY . .
WORKDIR "/src/UserServiceAPI"

# Build
RUN dotnet build "UserServiceAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "UserServiceAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Imagen final
FROM base AS final
WORKDIR /app

COPY --from=publish /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:5161
EXPOSE 5161


ENTRYPOINT ["dotnet", "UserServiceAPI.dll"]
