using System.Reflection;

namespace MtaaPulse.Tests;

public sealed class ArchitectureTests
{
    [Fact]
    public void DomainDoesNotDependOnOuterLayers()
    {
        var references = Assembly.Load("MtaaPulse.Domain")
            .GetReferencedAssemblies()
            .Select(assembly => assembly.Name);

        Assert.DoesNotContain("MtaaPulse.Infrastructure", references);
        Assert.DoesNotContain("MtaaPulse.WebAPI", references);
    }

    [Fact]
    public void ApplicationDoesNotDependOnOuterLayers()
    {
        var references = Assembly.Load("MtaaPulse.Application")
            .GetReferencedAssemblies()
            .Select(assembly => assembly.Name);

        Assert.DoesNotContain("MtaaPulse.Infrastructure", references);
        Assert.DoesNotContain("MtaaPulse.WebAPI", references);
    }
}
